/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CandidateProfile, Experience, Education } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Plus, Trash2, Edit2, Check, X, FileText, Globe, Linkedin 
} from "lucide-react";

interface Props {
  profile: CandidateProfile;
  onSave: (updated: CandidateProfile) => void;
}

export default function CandidateProfileComponent({ profile, onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CandidateProfile>({ ...profile });
  
  // New entry states
  const [newSkill, setNewSkill] = useState("");
  
  const [expCompany, setExpCompany] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expPeriod, setExpPeriod] = useState("");
  const [expDesc, setExpDesc] = useState("");
  
  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduPeriod, setEduPeriod] = useState("");

  const [simulatedFile, setSimulatedFile] = useState<string | null>(profile.resumeName || null);

  const startEdit = () => {
    setEditedProfile({ 
      ...profile,
      experiences: [...profile.experiences],
      education: [...profile.education],
      skills: [...profile.skills]
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile = { ...editedProfile, resumeName: simulatedFile || undefined };
    onSave(finalProfile);
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !editedProfile.skills.includes(newSkill.trim())) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter(s => s !== skillToRemove)
    });
  };

  const addExperience = () => {
    if (expCompany.trim() && expRole.trim() && expPeriod.trim()) {
      const newExp: Experience = {
        id: "exp-" + Date.now(),
        company: expCompany.trim(),
        role: expRole.trim(),
        period: expPeriod.trim(),
        description: expDesc.trim()
      };
      setEditedProfile({
        ...editedProfile,
        experiences: [...editedProfile.experiences, newExp]
      });
      // Reset inputs
      setExpCompany("");
      setExpRole("");
      setExpPeriod("");
      setExpDesc("");
    }
  };

  const removeExperience = (id: string) => {
    setEditedProfile({
      ...editedProfile,
      experiences: editedProfile.experiences.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    if (eduSchool.trim() && eduDegree.trim() && eduPeriod.trim()) {
      const newEdu: Education = {
        id: "edu-" + Date.now(),
        school: eduSchool.trim(),
        degree: eduDegree.trim(),
        period: eduPeriod.trim()
      };
      setEditedProfile({
        ...editedProfile,
        education: [...editedProfile.education, newEdu]
      });
      // Reset inputs
      setEduSchool("");
      setEduDegree("");
      setEduPeriod("");
    }
  };

  const removeEducation = (id: string) => {
    setEditedProfile({
      ...editedProfile,
      education: editedProfile.education.filter(edu => edu.id !== id)
    });
  };

  const triggerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const name = e.target.files[0].name;
      setSimulatedFile(name);
      if (isEditing) {
        setEditedProfile(prev => ({ ...prev, resumeName: name }));
      } else {
        onSave({ ...profile, resumeName: name });
      }
    }
  };

  return (
    <div className="space-y-8" id="candidate-profile-root">
      {/* Top Banner / Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8" id="profile-heading-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" id="profile-heading-flex">
          <div className="flex items-center gap-4 sm:gap-6" id="profile-avatar-block">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl shadow-inner" id="candidate-avatar">
              {profile.firstName[0]}{profile.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap" id="candidate-identity">
                <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Disponible
                </span>
              </div>
              <p className="text-indigo-600 font-medium mt-1 font-sans text-md sm:text-lg">{profile.title}</p>
              <div className="mt-2 text-slate-500 font-mono text-xs flex flex-wrap gap-x-4 gap-y-1" id="profile-contact-row">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {profile.phone}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3" id="profile-action-controls">
            {!isEditing ? (
              <button
                id="edit-profile-btn"
                onClick={startEdit}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition duration-150 shadow-sm cursor-pointer"
              >
                <Edit2 className="h-4 w-4" />
                Modifier mon profil
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto" id="profile-editing-buttons">
                <button
                  id="cancel-profile-edit"
                  onClick={cancelEdit}
                  className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition duration-150 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </button>
                <button
                  id="save-profile-btn"
                  onClick={handleSaveAll}
                  className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition duration-150 shadow-sm cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  Enregistrer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bio summary */}
        {!isEditing ? (
          <p className="mt-6 text-slate-600 leading-relaxed max-w-3xl" id="profile-bio-text">
            {profile.bio || "Aucune description fournie."}
          </p>
        ) : (
          <div className="mt-6" id="edit-bio-wrapper">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">À propos de moi (Bio)</label>
            <textarea
              id="edit-bio-textarea"
              rows={3}
              value={editedProfile.bio}
              onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition outline-none text-slate-700"
              placeholder="Rédigez une brève présentation professionnelle..."
            />
          </div>
        )}
      </div>

      {/* Main Core Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="profile-two-column-layout">
        
        {/* Left Side: Skills & Sidebar Metadata */}
        <div className="space-y-8" id="profile-sidebar">
          {/* Resume / CV & Links Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6" id="profile-resume-card">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-indigo-500" /> Document & Liens
            </h3>
            
            <div className="space-y-4" id="cv-upload-and-links">
              {/* CV Attachment Box */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3" id="cv-summary-box">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {simulatedFile || "Aucun CV importé"}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">Format PDF</p>
                  </div>
                </div>
                
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition shadow-sm">
                  <span>{simulatedFile ? "Remplacer" : "Importer"}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={triggerFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Editable Links */}
              {!isEditing ? (
                <div className="pt-2 space-y-2" id="links-view-mode">
                  {profile.portfolioUrl && (
                    <a
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition"
                      id="profile-portfolio-link"
                    >
                      <Globe className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{profile.portfolioUrl}</span>
                    </a>
                  )}
                  {profile.linkedInUrl && (
                    <a
                      href={profile.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition"
                      id="profile-linkedin-link"
                    >
                      <Linkedin className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{profile.linkedInUrl}</span>
                    </a>
                  )}
                  {!profile.portfolioUrl && !profile.linkedInUrl && (
                    <p className="text-sm text-slate-400 italic">Aucun lien professionnel renseigné.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-2" id="links-edit-mode">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Portfolio (Site Personnel)</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="url"
                        value={editedProfile.portfolioUrl || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, portfolioUrl: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-100 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Lien LinkedIn</label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="url"
                        value={editedProfile.linkedInUrl || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, linkedInUrl: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-100 outline-none"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Competences / Skills Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6" id="profile-skills-card">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-4">
              ✨ Compétences
            </h3>
            
            {/* Action Field to Add Skills */}
            {isEditing && (
              <div className="flex gap-2 mb-4" id="skill-add-bar">
                <input
                  type="text"
                  placeholder="Ex: React, Figma, SQL..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition duration-150 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* List of skills tags */}
            <div className="flex flex-wrap gap-2" id="profile-skills-wrapper">
              {(isEditing ? editedProfile.skills : profile.skills).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700"
                >
                  {skill}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
              {(isEditing ? editedProfile.skills : profile.skills).length === 0 && (
                <p className="text-sm text-slate-400 italic">Ajoutez vos premières compétences techniques ou soft skills.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Professional Experiences & Education */}
        <div className="lg:col-span-2 space-y-8" id="profile-main-timeline">
          
          {/* Experiences Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8" id="profile-experiences-card">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <Briefcase className="h-5 w-5 text-indigo-500" /> Expériences professionnelles
            </h3>

            {/* Add Experience form inside editing mode */}
            {isEditing && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 space-y-3" id="experience-adder-form">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ajouter une expérience</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Entreprise"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Intitulé du poste"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Période (Ex : 2022 - 2024)"
                    value={expPeriod}
                    onChange={(e) => setExpPeriod(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={addExperience}
                    className="sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-sm rounded-lg transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Ajouter l'expérience
                  </button>
                </div>
                <textarea
                  placeholder="Brève description de vos réalisations principales..."
                  rows={2}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
                />
              </div>
            )}

            {/* Timeline of experiences */}
            <div className="space-y-8 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-slate-100" id="experiences-list">
              {(isEditing ? editedProfile.experiences : profile.experiences).map((exp, index) => (
                <div key={exp.id} className="relative pl-10 group" id={`exp-item-${exp.id}`}>
                  {/* Timeline bullet */}
                  <div className="absolute left-1.5 top-1.5 h-4.5 w-4.5 rounded-full border-4 border-white bg-indigo-500 shadow-sm" />
                  
                  <div className="flex items-start justify-between gap-2" id={`exp-head-${exp.id}`}>
                    <div>
                      <h4 className="font-bold text-slate-800 text-md">{exp.role}</h4>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">{exp.company} <span className="mx-1.5 text-slate-300">•</span> <span className="font-mono text-xs">{exp.period}</span></p>
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                        title="Supprimer cette expérience"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed" id={`exp-desc-${exp.id}`}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
              {(isEditing ? editedProfile.experiences : profile.experiences).length === 0 && (
                <div className="pl-10 text-sm text-slate-400 italic">Aucune expérience professionnelle listée.</div>
              )}
            </div>
          </div>

          {/* Education / Certifications Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8" id="profile-education-card">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <GraduationCap className="h-5 w-5 text-indigo-500" /> Éducation & Formations
            </h3>

            {/* Add Education form within editing mode */}
            {isEditing && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6 space-y-3" id="education-adder-form">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ajouter une formation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="École / Université / Établissement"
                    value={eduSchool}
                    onChange={(e) => setEduSchool(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Diplôme / Titre obtenu"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Période (Ex : 2020 - 2023)"
                    value={eduPeriod}
                    onChange={(e) => setEduPeriod(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={addEducation}
                    className="sm:col-span-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-sm rounded-lg transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Ajouter l'éducation
                  </button>
                </div>
              </div>
            )}

            {/* Educational Timeline list */}
            <div className="space-y-6 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-slate-100" id="education-list">
              {(isEditing ? editedProfile.education : profile.education).map((edu, index) => (
                <div key={edu.id} className="relative pl-10 group" id={`edu-item-${edu.id}`}>
                  {/* Bullet */}
                  <div className="absolute left-1.5 top-1.5 h-4.5 w-4.5 rounded-full border-4 border-white bg-indigo-500 shadow-sm" />
                  
                  <div className="flex items-start justify-between gap-2" id={`edu-head-${edu.id}`}>
                    <div>
                      <h4 className="font-bold text-slate-800 text-md">{edu.degree}</h4>
                      <p className="text-slate-500 text-sm mt-0.5">{edu.school} <span className="mx-1.5 text-slate-300">•</span> <span className="font-mono text-xs">{edu.period}</span></p>
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                        title="Supprimer cette ligne informatique d'éducation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(isEditing ? editedProfile.education : profile.education).length === 0 && (
                <div className="pl-10 text-sm text-slate-400 italic">Aucune formation d'éducation renseignée.</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
