/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
}

export interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  resumeName?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
}

export interface JobOffer {
  id: string;
  title: string;
  department: string;
  location: string;
  contractType: "CDI" | "CDD" | "Alternance" | "Stage" | "Freelance";
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  createdAt: string;
  status: "active" | "closed" | "draft";
  companyName: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateTitle: string;
  coverLetter: string;
  status: "applied" | "shortlisted" | "interview" | "accepted" | "rejected";
  appliedAt: string;
  resumeName: string;
  notes?: string;
}
