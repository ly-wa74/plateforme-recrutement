/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { JobOffer, CandidateProfile } from "../types";
import { Search, MapPin, Briefcase, DollarSign, Calendar, SlidersHorizontal, ArrowUpDown, ChevronRight, X, Building } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  jobs: JobOffer; // Wait, actually it should be an array JobOffer[]!
}

interface JobListProps {
  jobs: JobOffer[];
  onApply: (job: JobOffer) => void;
  appliedJobIds: string[];
}

export default function JobList({ jobs, onApply, appliedJobIds }: JobListProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContract, setSelectedContract] = useState<string>("Tous");
  const [selectedDept, setSelectedDept] = useState<string>("Tous");
  
  // Selected Job for Detailed View (Modal or Side-drawn sheet)
  const [activeDetailJob, setActiveDetailJob] = useState<JobOffer | null>(null);

  // Departments list from the active jobs
  const departments = useMemo(() => {
    const set = new Set(jobs.map(j => j.department));
    return ["Tous", ...Array.from(set)];
  }, [jobs]);

  // Contract types
  const contractTypes = ["Tous", "CDI", "CDD", "Alternance", "Stage", "Freelance"];

  // Filtering logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (job.status !== "active") return false;

      const matchesSearch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesContract = selectedContract === "Tous" || job.contractType === selectedContract;
      const matchesDept = selectedDept === "Tous" || job.department === selectedDept;

      return matchesSearch && matchesContract && matchesDept;
    });
  }, [jobs, searchTerm, selectedContract, selectedDept]);

  return (
    <div className="space-y-6" id="job-list-container">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6" id="jobs-filter-card">
        <div className="flex flex-col md:flex-row gap-4" id="search-inputs-block">
          {/* Main search bar */}
          <div className="relative flex-1" id="search-input-wrapper">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par métier, mot-clé ou entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm outline-none transition"
              id="jobs-search-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 transition"
              >
                Vider
              </button>
            )}
          </div>

          {/* Department combobox/filter */}
          <div className="w-full md:w-56" id="dept-filter-wrapper">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-sm outline-none transition text-slate-700 font-medium"
              id="department-select"
            >
              <option disabled>Département / Équipe</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept === "Tous" ? "Tous les départements" : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick pill filters for Contract type */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-50" id="contract-filters-row">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Type de contrat :
          </span>
          {contractTypes.map((contract) => (
            <button
              key={contract}
              id={`contract-filter-btn-${contract}`}
              onClick={() => setSelectedContract(contract)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition cursor-pointer ${
                selectedContract === contract
                  ? "bg-indigo-600 border border-indigo-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {contract === "Tous" ? "Tous les contrats" : contract}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: job lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="jobs-main-grid">
        {/* Jobs display list (Left two wide columns) */}
        <div className="lg:col-span-2 space-y-4" id="listings-wrapper-col">
          <div className="flex items-center justify-between" id="results-meta-row">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              {filteredJobs.length} {filteredJobs.length <= 1 ? "offre d'emploi trouvée" : "offres d'emploi trouvées"}
            </h2>
          </div>

          <div className="space-y-4" id="jobs-vlist">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => {
                const isApplied = appliedJobIds.includes(job.id);
                return (
                  <motion.div
                    key={job.id}
                    layoutId={`job-card-${job.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`bg-white rounded-2xl border p-5 sm:p-6 transition shadow-sm hover:shadow-md hover:border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer relative ${
                      activeDetailJob?.id === job.id 
                        ? "border-indigo-600 ring-2 ring-indigo-50" 
                        : "border-slate-100"
                    }`}
                    onClick={() => setActiveDetailJob(job)}
                    id={`job-card-item-${job.id}`}
                  >
                    <div className="space-y-2.5 max-w-xl" id={`job-card-metas-${job.id}`}>
                      {/* Department and contract type row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {job.contractType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100/50">
                          {job.department}
                        </span>
                        {isApplied && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Candidature déposée
                          </span>
                        )}
                      </div>

                      {/* Job Title and Company */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition tracking-tight">
                          {job.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-slate-400" />
                          {job.companyName}
                        </p>
                      </div>

                      {/* Basic badges */}
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-mono text-slate-400" id={`job-meta-badges-${job.id}`}>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-300" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-slate-300" />
                          {job.salary}
                        </span>
                      </div>
                    </div>

                    {/* Go to Details visual button */}
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 sm:self-center shrink-0 self-end select-none group" id={`view-trigger-${job.id}`}>
                      <span>Voir les détails</span>
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition duration-150" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredJobs.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8" id="empty-search-state">
                <p className="text-slate-400 text-lg">Aucune offre d’emploi ne correspond à vos filtres de recherche.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedDept("Tous");
                    setSelectedContract("Tous");
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-semibold text-xs transition cursor-pointer"
                  id="reset-search-btn"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Selected Job Description detailed panel (sticky right rail) */}
        <div className="lg:col-span-1" id="sticky-details-panel-col">
          <div className="sticky top-6" id="sticky-details-wrap">
            {activeDetailJob ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 overflow-hidden max-h-[85vh] flex flex-col"
                id="details-card"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4" id="details-header">
                  <div className="min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 inline-block">
                      {activeDetailJob.contractType}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-2 tracking-tight line-clamp-2">
                      {activeDetailJob.title}
                    </h2>
                    <p className="text-sm font-semibold text-slate-500 mt-1">{activeDetailJob.companyName}</p>
                  </div>
                  <button
                    onClick={() => setActiveDetailJob(null)}
                    className="p-1 px-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                    title="Fermer le détail"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-5 pr-2" id="details-scroller">
                  {/* Location & Salary */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-600" id="details-metadata-badges">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-sans">Localisation</span>
                      <span className="font-semibold flex items-center gap-1 text-slate-700">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" /> {activeDetailJob.location}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-sans">Rémunération</span>
                      <span className="font-semibold flex items-center gap-1 text-slate-700">
                        <DollarSign className="h-3 w-3 text-slate-400 shrink-0" /> {activeDetailJob.salary}
                      </span>
                    </div>
                  </div>

                  {/* Pitch description */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans">Présentation de l'offre</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {activeDetailJob.description}
                    </p>
                  </div>

                  {/* Requirements list */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans">Profil recherché & Prérequis</h4>
                    <ul className="space-y-1.5" id="offer-requirements-list">
                      {activeDetailJob.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Responsibilities list */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans">Missions principales</h4>
                    <ul className="space-y-1.5" id="offer-responsibilities-list">
                      {activeDetailJob.responsibilities.map((res, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Submitting button */}
                <div className="pt-4 border-t border-slate-100 mt-4" id="details-apply-bar">
                  <button
                    id="apply-for-selected-job-btn"
                    disabled={appliedJobIds.includes(activeDetailJob.id)}
                    onClick={() => onApply(activeDetailJob)}
                    className={`w-full py-3 px-6 font-semibold rounded-xl text-sm transition duration-150 inline-flex items-center justify-center gap-2 cursor-pointer ${
                      appliedJobIds.includes(activeDetailJob.id)
                        ? "bg-emerald-50 border border-emerald-100 text-emerald-700 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    {appliedJobIds.includes(activeDetailJob.id) 
                      ? "Candidature Déposée" 
                      : "Postuler à cette offre"}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 font-mono mt-2">
                    Publiée le {activeDetailJob.createdAt}
                  </p>
                </div>
              </motion.div>
            ) : (
              /* No selection placeholder */
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 py-16 text-center text-slate-400" id="details-empty-placeholder">
                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-600 text-md">Sélectionnez une offre d’emploi</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Cliquez sur une offre d'emploi de la liste de gauche pour en afficher les missions, requis de compétences et postuler en ligne en un clic.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
