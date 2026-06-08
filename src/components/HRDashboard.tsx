/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { JobOffer, Application, CandidateProfile } from "../types";
import { 
  Briefcase, Users, CheckCircle, Clock, XCircle, ArrowRight,
  TrendingUp, FileText, Send, UserCheck, Plus, Check, Trash2, 
  Eye, MessageSquare, AlertCircle, Sparkles, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HRDashboardProps {
  jobs: JobOffer[];
  applications: Application[];
  onAddJob: (newJob: Omit<JobOffer, "id" | "createdAt">) => void;
  onUpdateApplicationStatus: (appId: string, status: Application["status"], notes?: string) => void;
  onToggleJobStatus: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
}

export default function HRDashboard({ 
  jobs, 
  applications, 
  onAddJob, 
  onUpdateApplicationStatus,
  onToggleJobStatus,
  onDeleteJob
}: HRDashboardProps) {
  // Navigation tabs within HR dashboard
  const [activeSubTab, setActiveSubTab] = useState<"applications" | "jobs" | "add-job">("applications");

  // Filter application states
  const [appStatusFilter, setAppStatusFilter] = useState<string>("Tous");
  
  // Selected Application for detail preview
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const [candidateNotes, setCandidateNotes] = useState("");

  // New Job formulation states
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Engineering");
  const [newLocation, setNewLocation] = useState("");
  const [newContract, setNewContract] = useState<JobOffer["contractType"]>("CDI");
  const [newSalary, setNewSalary] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newReqsText, setNewReqsText] = useState("");
  const [newRespsText, setNewRespsText] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("Plateforme RH Direct");

  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);

  // Compute metric cards
  const metrics = useMemo(() => {
    const totalJobs = jobs.filter(j => j.status === "active").length;
    const totalApps = applications.length;
    const pendingApps = applications.filter(a => a.status === "applied").length;
    const interviewApps = applications.filter(a => a.status === "interview" || a.status === "shortlisted").length;
    const acceptedApps = applications.filter(a => a.status === "accepted").length;
    const rejectedApps = applications.filter(a => a.status === "rejected").length;

    return { totalJobs, totalApps, pendingApps, interviewApps, acceptedApps, rejectedApps };
  }, [jobs, applications]);

  // Filters candidates in the sidebar
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      if (appStatusFilter === "Tous") return true;
      return app.status === appStatusFilter;
    });
  }, [applications, appStatusFilter]);

  // Handle Adding Jobs
  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim() || !newSalary.trim() || !newDesc.trim()) {
      alert("Veuillez renseigner les champs requis essentiels.");
      return;
    }

    // Parse comma or newline separated lists
    const requirements = newReqsText
      .split(/[,\n]/)
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const responsibilities = newRespsText
      .split(/[,\n]/)
      .map(r => r.trim())
      .filter(r => r.length > 0);

    onAddJob({
      title: newTitle.trim(),
      department: newDept,
      location: newLocation.trim(),
      contractType: newContract,
      salary: newSalary.trim(),
      description: newDesc.trim(),
      requirements: requirements.length > 0 ? requirements : ["Autonomie et rigueur professionnelle."],
      responsibilities: responsibilities.length > 0 ? responsibilities : ["Participer quotidiennement à la vie d'équipe."],
      status: "active",
      companyName: newCompanyName.trim()
    });

    // Reset Form
    setNewTitle("");
    setNewLocation("");
    setNewSalary("");
    setNewDesc("");
    setNewReqsText("");
    setNewRespsText("");
    
    setFormSuccessMessage("L'offre d’emploi a été publiée avec succès !");
    setActiveSubTab("jobs");
    setTimeout(() => setFormSuccessMessage(null), 4000);
  };

  // Status Style badge translator
  const getStatusStyle = (status: Application["status"]) => {
    switch (status) {
      case "applied":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "shortlisted":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "interview":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getStatusLabelText = (status: Application["status"]) => {
    switch (status) {
      case "applied": return "À évaluer";
      case "shortlisted": return "Présélectionné";
      case "interview": return "Entretien programmé";
      case "accepted": return "Candidat Retenu";
      case "rejected": return "Candidature Refusée";
    }
  };

  const handleUpdateStatusClick = (status: Application["status"]) => {
    if (!activeApplication) return;
    onUpdateApplicationStatus(activeApplication.id, status, candidateNotes);
    // Sync local object in view
    setActiveApplication({
      ...activeApplication,
      status: status,
      notes: candidateNotes
    });
  };

  const handleSaveNotesOnly = () => {
    if (!activeApplication) return;
    onUpdateApplicationStatus(activeApplication.id, activeApplication.status, candidateNotes);
    setActiveApplication({
      ...activeApplication,
      notes: candidateNotes
    });
    alert("Commentaires et notes enregistrés !");
  };

  return (
    <div className="space-y-8" id="hr-dashboard-root">
      {/* Analytics stats banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="hr-metrics-grid">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Offres Actives</p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">{metrics.totalJobs}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Candidatures reçues</p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">{metrics.totalApps}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50/70 text-indigo-700 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">En Phase Entretien</p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">{metrics.interviewApps}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Candidats Retenus</p>
            <p className="text-2xl font-bold text-slate-800 tracking-tight mt-0.5">{metrics.acceptedApps}</p>
          </div>
        </div>
      </div>

      {formSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl font-medium text-sm">
          {formSuccessMessage}
        </div>
      )}

      {/* Main dashboard tab header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3" id="hr-tab-header">
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl w-fit" id="sub-navigation-pills">
          <button
            onClick={() => { setActiveSubTab("applications"); setActiveApplication(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-150 cursor-pointer ${
              activeSubTab === "applications"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Suivi des Candidatures ({applications.length})
          </button>
          
          <button
            onClick={() => setActiveSubTab("jobs")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-150 cursor-pointer ${
              activeSubTab === "jobs"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Gestion des Offres ({jobs.length})
          </button>
        </div>

        <div>
          <button
            onClick={() => setActiveSubTab("add-job")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition cursor-pointer"
            id="create-offer-btn"
          >
            <Plus className="h-4 w-4" /> Publier une offre
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: CANDIDATURES (APPLICATIONS TRACKING) */}
      {activeSubTab === "applications" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="hr-tracking-application-container">
          
          {/* Applications list sidebar (Left column) */}
          <div className="space-y-4" id="hr-apps-sidebar-col">
            <div className="bg-white rounded-2xl border border-slate-150 p-4" id="sidebar-filters-panel">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Statut candidature</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2" id="sidebar-filter-pills-wrap">
                {["Tous", "applied", "shortlisted", "interview", "accepted", "rejected"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                      appStatusFilter === filter
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {filter === "Tous" ? "Toutes" : getStatusLabelText(filter as Application["status"])}
                  </button>
                ))}
              </div>
            </div>

            {/* List scrollbox */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1" id="hr-applications-vlist">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    setActiveApplication(app);
                    setCandidateNotes(app.notes || "");
                  }}
                  className={`p-4 rounded-2xl border bg-white cursor-pointer transition flex flex-col gap-3 hover:border-slate-300 ${
                    activeApplication?.id === app.id 
                      ? "ring-2 ring-indigo-50 border-indigo-500" 
                      : "border-slate-100"
                  }`}
                  id={`hr-app-card-${app.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{app.candidateName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{app.candidateTitle}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getStatusStyle(app.status)}`}>
                      {getStatusLabelText(app.status)}
                    </span>
                  </div>

                  <div className="border-t border-slate-50 pt-2.5 flex items-center justify-between text-xs text-slate-400" id={`hr-app-sub-${app.id}`}>
                    <span className="truncate max-w-[120px]" title={app.jobTitle}>🏷️ {app.jobTitle}</span>
                    <span className="font-mono text-[10px]">{app.appliedAt}</span>
                  </div>
                </div>
              ))}

              {filteredApps.length === 0 && (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 font-sans" id="empty-apps-alert">
                  <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm">Aucune candidature correspondante.</p>
                </div>
              )}
            </div>
          </div>

          {/* Application Detail View & Decision matrix (sticky right columns) */}
          <div className="lg:col-span-2" id="hr-app-detail-col">
            {activeApplication ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6" id="app-manager-pane">
                
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-5" id="app-detail-header-row">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-2 ${getStatusStyle(activeApplication.status)}`}>
                      {getStatusLabelText(activeApplication.status)}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{activeApplication.candidateName}</h2>
                    <p className="text-indigo-600 font-medium text-sm mt-0.5">Postulant pour : {activeApplication.jobTitle}</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">Mail : {activeApplication.candidateEmail} <span className="mx-2">|</span> Déposé le {activeApplication.appliedAt}</p>
                  </div>

                  <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/30 text-center flex flex-col items-center justify-center shrink-0" id="cv-attachment-pill">
                    <FileText className="h-5 w-5 text-indigo-500 mb-1" />
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]" title={activeApplication.resumeName}>
                      {activeApplication.resumeName}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Simulé en ligne</span>
                  </div>
                </div>

                {/* Candidate letter of motivation */}
                <div className="space-y-2" id="app-detail-motivation bg">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-slate-300" /> Lettre de motivation
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto" id="letter-content-container">
                    {activeApplication.coverLetter || "Aucune lettre de motivation n'a été rédigée pour cette candidature."}
                  </div>
                </div>

                {/* HR Action Board: Decision Matrix & Status changer */}
                <div className="p-5 bg-slate-50/50 border border-slate-150 rounded-2xl space-y-4" id="app-decision-box">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prendre une décision de recrutement</h3>
                  
                  <div className="flex flex-wrap gap-2.5" id="decision-actions-row">
                    <button
                      onClick={() => handleUpdateStatusClick("shortlisted")}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        activeApplication.status === "shortlisted"
                          ? "bg-blue-600 text-white border-blue-600 shadow"
                          : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Présélectionner
                    </button>

                    <button
                      onClick={() => handleUpdateStatusClick("interview")}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        activeApplication.status === "interview"
                          ? "bg-indigo-600 text-white border-indigo-600 shadow"
                          : "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      }`}
                    >
                      <Users className="h-3.5 w-3.5" /> Programmer Entretien
                    </button>

                    <button
                      onClick={() => handleUpdateStatusClick("accepted")}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        activeApplication.status === "accepted"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow"
                          : "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" /> Retenir Candidat
                    </button>

                    <button
                      onClick={() => handleUpdateStatusClick("rejected")}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        activeApplication.status === "rejected"
                          ? "bg-rose-600 text-white border-rose-600 shadow"
                          : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50"
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Recaler Candidat
                    </button>
                  </div>
                </div>

                {/* Follow up comments text box */}
                <div className="space-y-2.5" id="candidate-hr-comments-wrapper">
                  <div className="flex justify-between items-center" id="comments-title-bar">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Notes internes & Commentaires d'évaluation
                    </label>
                    <button
                      onClick={handleSaveNotesOnly}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-bold cursor-pointer transition"
                    >
                      Enregistrer les notes
                    </button>
                  </div>
                  <textarea
                    id="hr-notes-comments"
                    rows={3}
                    value={candidateNotes}
                    onChange={(e) => setCandidateNotes(e.target.value)}
                    placeholder="Évaluation technique, questions à poser, avis des managers..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/20"
                  />
                </div>

              </div>
            ) : (
              /* Detail selection placeholder */
              <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8 py-20 text-center text-slate-400" id="decision-detail-placeholder">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-600 text-md">Consulter une candidature</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Veuillez sélectionner un profil de candidat dans la liste de gauche pour analyser ses motivations, sa lettre d'accompagnement, valider ses documents et statuer sur sa candidature.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: GESTION DES OFFRES (MANAGE JOB POSTINGS) */}
      {activeSubTab === "jobs" && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden" id="manage-offers-panel">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4 mb-4" id="manage-offers-header">
            <h3 className="font-bold text-slate-800 text-lg">Liste des offres d’emploi publiées</h3>
            <span className="text-xs font-semibold text-slate-400">{jobs.length} offres totales</span>
          </div>

          <div className="overflow-x-auto" id="jobs-table-scroller">
            <table className="w-full text-left border-collapse" id="hr-jobs-status-table">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4 font-semibold">Titre du poste & Entreprise</th>
                  <th className="py-4 px-4 font-semibold">Équipe / Service</th>
                  <th className="py-4 px-4 font-semibold">Type de contrat</th>
                  <th className="py-4 px-4 font-semibold">Localisation</th>
                  <th className="py-4 px-4 font-semibold">Statut administratif</th>
                  <th className="py-4 px-4 font-semibold text-right">Actions de suivi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition" id={`hr-table-row-${job.id}`}>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div>
                        {job.title}
                        <p className="text-xs text-slate-400 font-normal mt-0.5">{job.companyName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-mono text-xs">{job.department}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                        {job.contractType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-medium text-xs">{job.location}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        job.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${job.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {job.status === "active" ? "Ouverte" : "Fermée / Brouillon"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2" id={`job-admin-actions-${job.id}`}>
                        <button
                          onClick={() => onToggleJobStatus(job.id)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
                            job.status === "active"
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                              : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200"
                          }`}
                          title="Fermer ou ouvrir l'offre d'emploi"
                        >
                          {job.status === "active" ? "Clôturer" : "Ouvrir"}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Êtes-vous sûr de vouloir supprimer l'offre d'emploi "${job.title}" ?`)) {
                              onDeleteJob(job.id);
                            }
                          }}
                          className="p-1 px-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-150 cursor-pointer"
                          title="Supprimer l'offre définitivement"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: AJOUTER UNE OFFRE D'EMPLOI FORM (PUBLICATION FORM) */}
      {activeSubTab === "add-job" && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto" id="offer-creator-container">
          <div className="border-b border-slate-50 pb-4 mb-6" id="form-heading-row">
            <h3 className="font-bold text-slate-800 text-xl flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" /> Rédiger et publier une nouvelle opportunité
            </h3>
            <p className="text-xs text-slate-400 mt-1">Saisissez les informations opérationnelles pour diffuser cette offre auprès des candidats.</p>
          </div>

          <form onSubmit={handleSubmitJob} className="space-y-6" id="job-creator-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="form-grid-mains">
              
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Intitulé officiel du poste <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Ingénieur Logiciel Front-End Tech Lead"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nom de l'entreprise <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex : InnovTech Solutions"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Équipe / Département <span className="text-red-500">*</span></label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30"
                >
                  <option value="Engineering">Engineering / Informatique</option>
                  <option value="Design">Product Design / UI-UX</option>
                  <option value="Marketing">Marketing / Growth</option>
                  <option value="Sales">Sales / Business Development</option>
                  <option value="RH">Ressources Humaines</option>
                  <option value="finance">Finance / Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type de contrat <span className="text-red-500">*</span></label>
                <select
                  value={newContract}
                  onChange={(e) => setNewContract(e.target.value as JobOffer["contractType"])}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30 font-semibold"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Alternance">Alternance</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Salaire indicatif <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex : 45k€ - 50k€ ou Selon profil"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Localisation physique <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Paris, France (3 jours télétravail)"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description complète de l'offre <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="Expliquez en détails les projets technologiques, le paysage opérationnel et les perspectives d'évolution de ce poste..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30"
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Profil requis / Compétences attendues</label>
                  <span className="text-[10px] text-slate-400">Séparez les lignes par des retours à la ligne ou des virgules</span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Ex : Maîtrise avancée de React et d'Express&#10;Capacité à rédiger du code robuste&#10;Esprit d'équipe"
                  value={newReqsText}
                  onChange={(e) => setNewReqsText(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30"
                />
              </div>

              <div className="col-span-2">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Missions conférées au quotidien</label>
                  <span className="text-[10px] text-slate-400">Séparez les lignes par des retours à la ligne ou des virgules</span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Ex : Développer des flux de données web&#10;Assurer la qualité globale des composants&#10;Collaborer avec les Designers Figma"
                  value={newRespsText}
                  onChange={(e) => setNewRespsText(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm text-slate-700 bg-slate-50/30"
                />
              </div>

            </div>

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100" id="form-creator-actions">
              <button
                type="button"
                onClick={() => setActiveSubTab("applications")}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-650 text-sm font-semibold rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:shadow shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Diffuser l'offre d'emploi
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
