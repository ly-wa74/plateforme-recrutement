/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { JobOffer, CandidateProfile, Application } from "../types";
import { motion } from "motion/react";
import { X, Send, FileCode, CheckCircle, UploadCloud, AlertCircle } from "lucide-react";

interface Props {
  job: JobOffer;
  profile: CandidateProfile;
  onClose: () => void;
  onSubmit: (application: Omit<Application, "id" | "appliedAt">) => void;
}

export default function ApplicationForm({ job, profile, onClose, onSubmit }: Props) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeName, setResumeName] = useState(profile.resumeName || "");
  const [isCVDropActive, setIsCVDropActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const simulateDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCVDropActive(true);
  };

  const simulateDragLeave = () => {
    setIsCVDropActive(false);
  };

  const simulateDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCVDropActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setResumeName(e.dataTransfer.files[0].name);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeName.trim()) {
      setErrorStatus("Veuillez importer ou renseigner un CV pour postuler.");
      return;
    }
    setErrorStatus(null);
    
    onSubmit({
      jobId: job.id,
      jobTitle: job.title,
      candidateId: profile.id,
      candidateName: `${profile.firstName} ${profile.lastName}`,
      candidateEmail: profile.email,
      candidateTitle: profile.title,
      coverLetter: coverLetter,
      status: "applied",
      resumeName: resumeName
    });

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" id="application-modal">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl w-full max-w-2xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        id="application-modal-content"
      >
        {/* Header area */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50" id="application-modal-header">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Candidature directe</span>
            <h2 className="text-xl font-bold text-slate-800 truncate max-w-md mt-0.5" title={job.title}>
              {job.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{job.companyName} <span className="mx-1">•</span> {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            id="close-application-modal-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content area */}
        {!isSuccess ? (
          <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6" id="application-form">
            
            {/* Candidate Identity Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100" id="candidate-identity-preview">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vos informations de profil</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm" id="identity-grid">
                <div>
                  <span className="text-slate-400 block text-xs">Nom complet</span>
                  <span className="font-semibold text-slate-800">{profile.firstName} {profile.lastName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Intitulé</span>
                  <span className="font-semibold text-slate-800 truncate block">{profile.title}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-xs text-ellipsis">E-mail</span>
                  <span className="font-medium text-slate-700 break-all">{profile.email}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-xs">Téléphone</span>
                  <span className="font-medium text-slate-700">{profile.phone}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-3 italic">
                Remarque : Les informations de profil ci-dessus seront transmises au recruteur. Vous pouvez les modifier à tout moment sur l'onglet "Mon profil".
              </p>
            </div>

            {/* Resume Upload Box */}
            <div className="space-y-2" id="resume-upload-wrapper">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Résumé / Curriculum Vitae (CV) <span className="text-red-500">*</span>
              </label>
              
              <div
                onDragOver={simulateDragOver}
                onDragLeave={simulateDragLeave}
                onDrop={simulateDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                  isCVDropActive 
                    ? "border-indigo-500 bg-indigo-50/50" 
                    : resumeName 
                    ? "border-indigo-100 bg-indigo-50/10 hover:bg-indigo-50/30" 
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/20"
                }`}
                id="resume-drag-drop-zone"
              >
                <input
                  type="file"
                  id="file-upload-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleManualUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload-input" className="cursor-pointer w-full flex flex-col items-center">
                  <UploadCloud className={`h-10 w-10 mb-2 ${resumeName ? 'text-indigo-500' : 'text-slate-400'}`} />
                  {resumeName ? (
                    <div>
                      <p className="text-sm font-semibold text-slate-800">CV sélectionné : {resumeName}</p>
                      <p className="text-xs text-slate-400 mt-1">Glissez-déposez ou cliquez pour modifier le fichier</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Glissez-déposez votre CV ici, ou <span className="text-indigo-600 underline">parcourez</span></p>
                      <p className="text-xs text-slate-400 mt-1">Formats PDF ou Word (Max 5Mo)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Cover Letter Text Area */}
            <div className="space-y-2" id="cover-letter-wrapper">
              <div className="flex justify-between items-center" id="letter-title-row">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lettre de motivation / Message d'accompagnement
                </label>
                <span className="text-xs text-slate-400">Optionnel</span>
              </div>
              <textarea
                id="application-cover-letter"
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition outline-none text-slate-700 text-sm"
                placeholder="Expliquez en quelques lignes pourquoi votre profil correspond parfaitement aux critères attendus pour cette offre d’emploi..."
              />
            </div>

            {/* Error notifications */}
            {errorStatus && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-sm" id="application-error">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorStatus}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex text-right justify-end gap-3 pt-4 border-t border-slate-50" id="form-action-row">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                id="cancel-application-btn"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl hover:shadow-md transition duration-150 inline-flex items-center gap-2 cursor-pointer"
                id="submit-application-btn"
              >
                <Send className="h-4 w-4" />
                Soumettre ma candidature
              </button>
            </div>

          </form>
        ) : (
          /* Success Screen view */
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4" id="application-success-view">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Candidature envoyée avec succès !</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                Votre candidature chez <strong>{job.companyName}</strong> a été enregistrée. L'équipe de recrutement vous recontactera très prochainement par e-mail ({profile.email}).
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition cursor-pointer"
              id="success-dismiss-btn"
            >
              Fermer la fenêtre
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
