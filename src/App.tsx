/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  getSavedJobs, saveJobs, 
  getSavedProfile, saveProfile, 
  getSavedApplications, saveApplications 
} from "./data";
import { JobOffer, CandidateProfile, Application } from "./types";
import JobList from "./components/JobList";
import CandidateProfileComponent from "./components/CandidateProfileComponent";
import ApplicationForm from "./components/ApplicationForm";
import HRDashboard from "./components/HRDashboard";
import { Briefcase, User, ShieldCheck, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  // Primary Navigation tabs
  const [activeTab, setActiveTab] = useState<"jobs" | "profile" | "hr">("jobs");

  // Core synchronized states
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  // Modal flow states
  const [intendedApplyJob, setIntendedApplyJob] = useState<JobOffer | null>(null);

  // Initialize and load persistent data from standard browser local storage
  useEffect(() => {
    setJobs(getSavedJobs());
    setProfile(getSavedProfile());
    setApplications(getSavedApplications());
  }, []);

  // Sync methods to handle state updates & localStorage persistence safely
  const handleProfileSave = (updatedProfile: CandidateProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  const handleApplySubmission = (newAppDetails: Omit<Application, "id" | "appliedAt">) => {
    const freshApp: Application = {
      ...newAppDetails,
      id: "app-" + Date.now(),
      appliedAt: new Date().toISOString().split("T")[0] // Current Date: YYYY-MM-DD
    };

    const nextApps = [freshApp, ...applications];
    setApplications(nextApps);
    saveApplications(nextApps);
  };

  const handleAddJobOffer = (newJobDetails: Omit<JobOffer, "id" | "createdAt">) => {
    const freshJob: JobOffer = {
      ...newJobDetails,
      id: "job-" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0]
    };

    const nextJobs = [freshJob, ...jobs];
    setJobs(nextJobs);
    saveJobs(nextJobs);
  };

  const handleUpdateApplicationStatus = (
    appId: string, 
    status: Application["status"], 
    notes?: string
  ) => {
    const updatedApps = applications.map(app => {
      if (app.id === appId) {
        return { ...app, status, notes };
      }
      return app;
    });
    setApplications(updatedApps);
    saveApplications(updatedApps);
  };

  const handleToggleJobStatus = (jobId: string) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const nextStatus: JobOffer["status"] = job.status === "active" ? "closed" : "active";
        return { ...job, status: nextStatus };
      }
      return job;
    });
    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  };

  const handleDeleteJobOffer = (jobId: string) => {
    const remainingJobs = jobs.filter(j => j.id !== jobId);
    setJobs(remainingJobs);
    saveJobs(remainingJobs);
    
    // Also mark applications associated with this job as "rejected" or clean them up? Let's keep applications or alter them.
  };

  // Helper arrays for convenient lookup in UI
  const appliedJobIds = applications.map(app => app.jobId);

  // Clear data and reset mock state function
  const handleResetApplicationDatabase = () => {
    if (confirm("Voulez-vous réinitialiser toutes les données de simulation par défaut ? Vos modifications locales seront remplacées.")) {
      localStorage.removeItem("recruitment_platform_jobs");
      localStorage.removeItem("recruitment_platform_profile");
      localStorage.removeItem("recruitment_platform_applications");
      
      setJobs(getSavedJobs());
      setProfile(getSavedProfile());
      setApplications(getSavedApplications());
      setActiveTab("jobs");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900" id="app-root">
      
      {/* Primary Header Navbar with Professional Polish colors */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-md" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4" id="header-container">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("jobs")} id="app-logo">
            <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-md sm:text-lg font-bold text-white tracking-tight font-display">
                TalentFlow
              </h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider -mt-1 font-mono">PLATEFORME RH & CARRIÈRE</p>
            </div>
          </div>

          {/* Tab Navigation links with custom design highlights */}
          <nav className="flex items-center gap-1 sm:gap-2" id="primary-navigation-tabs">
            <button
              id="tab-btn-jobs"
              onClick={() => setActiveTab("jobs")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "jobs"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Offres d'emploi</span>
              <span className="sm:hidden">Offres</span>
            </button>

            <button
              id="tab-btn-profile"
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Mon profil candidat</span>
              <span className="sm:hidden">Profil</span>
            </button>

            <button
              id="tab-btn-hr"
              onClick={() => setActiveTab("hr")}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "hr"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-indigo-300" />
              <span className="hidden sm:inline">Tableau de bord RH</span>
              <span className="sm:hidden">Espace RH</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app-main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
            id="fade-container-views"
          >
            {/* VIEW 1: JOB LIST (CAREERS FORUM) */}
            {activeTab === "jobs" && (
              <JobList 
                jobs={jobs} 
                onApply={(job) => setIntendedApplyJob(job)} 
                appliedJobIds={appliedJobIds}
              />
            )}

            {/* VIEW 2: PROFILE EDITOR */}
            {activeTab === "profile" && profile && (
              <CandidateProfileComponent 
                profile={profile} 
                onSave={handleProfileSave} 
              />
            )}

            {/* VIEW 3: HR RECRUITER DESK */}
            {activeTab === "hr" && (
              <HRDashboard 
                jobs={jobs} 
                applications={applications} 
                onAddJob={handleAddJobOffer}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                onToggleJobStatus={handleToggleJobStatus}
                onDeleteJob={handleDeleteJobOffer}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent footer with platform info and simulation restorer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-medium">
            © {new Date().getFullYear()} TalentFlow — Plateforme de Recrutement Intelligente. Tous droits réservés.
          </p>

          <div className="flex items-center gap-4" id="footer-actions">
            <button
              onClick={handleResetApplicationDatabase}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 hover:bg-slate-50 text-slate-500 rounded-lg font-medium transition cursor-pointer"
              title="Réinitialiser les données d'essai"
              id="reset-database-btn"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Réinitialiser la simulation
            </button>
          </div>
        </div>
      </footer>

      {/* Simulated CV Application Form Modal */}
      {intendedApplyJob && profile && (
        <ApplicationForm 
          job={intendedApplyJob} 
          profile={profile} 
          onClose={() => setIntendedApplyJob(null)} 
          onSubmit={handleApplySubmission}
        />
      )}

    </div>
  );
}
