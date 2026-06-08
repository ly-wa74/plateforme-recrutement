/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JobOffer, CandidateProfile, Application } from "./types";

export const INITIAL_JOBS: JobOffer[] = [
  {
    id: "job-1",
    title: "Développeur Full-Stack React & Node.js",
    department: "Engineering",
    location: "Paris, France (Hybride)",
    contractType: "CDI",
    salary: "48k€ - 55k€",
    companyName: "InnovTech Solutions",
    description: "Nous recherchons un développeur ou une développeuse Senior Fullstack pour rejoindre notre équipe produit. Vous contribuerez directement à l'évolution de notre plateforme SaaS d'optimisation énergétique.",
    requirements: [
      "Minimum 3 ans d'expérience opérationnelle avec React et Node.js (Express/NestJS).",
      "Bonne maîtrise de TypeScript, SQL (PostgreSQL) et des concepts d'API RESTful.",
      "Sensibilité fine aux problématiques de performance et de sécurité web.",
      "Esprit d'équipe, curiosité technique et goût du travail collaboratif."
    ],
    responsibilities: [
      "Concevoir, implémenter et tester de nouvelles fonctionnalités robustes.",
      "Participer à l'architecture informatique globale et au processus de revue de code.",
      "Optimiser l'expérience utilisateur et les temps de chargement de l'application.",
      "Collaborer étroitement avec les équipes Product Managers et UI/UX Designers."
    ],
    createdAt: "2026-06-01",
    status: "active"
  },
  {
    id: "job-2",
    title: "Product Designer UI/UX Senior",
    department: "Design",
    location: "Bordeaux, France",
    contractType: "CDI",
    salary: "45k€ - 52k€",
    companyName: "CreativeCanvas LLC",
    description: "Vous êtes passionné par la conception de parcours utilisateurs intuitifs, fluides et esthétiques ? Rejoignez notre pôle design pour façonner l'identité visuelle et l'accessibilité de nos applications web et mobiles.",
    requirements: [
      "4 ans d'expérience ou plus en design d'interfaces de produits numériques complexes.",
      "Maîtrise avancée de Figma (composants complexes, variables, design system).",
      "Solides bases en recherche utilisateur (interviews, tests d'utilisabilité, personas).",
      "Capacité à vulgariser et argumenter ses choix de design auprès de l'équipe technique."
    ],
    responsibilities: [
      "Mener des ateliers de co-conception avec les parties-prenantes.",
      "Créer des wireframes, flux d'écrans et prototypes interactifs haute-fidélité.",
      "Maintenir et documenter notre Design System d'entreprise.",
      "Tester les réalisations front-end pour garantir la fidélité de l'implémentation."
    ],
    createdAt: "2026-06-03",
    status: "active"
  },
  {
    id: "job-3",
    title: "Chef de Projet Marketing Digital",
    department: "Marketing",
    location: "Lyon, France (Télétravail autorisé)",
    contractType: "CDD",
    salary: "38k€ - 42k€",
    companyName: "EcoAct Group",
    description: "Notre groupe engagé dans la transition écologique recherche un(e) Chef de Projet Marketing pour piloter nos campagnes d'acquisition et animer notre communauté professionnelle sur divers canaux numériques.",
    requirements: [
      "Diplôme Bac+5 en École de Commerce / Communication ou équivalent.",
      "Maîtrise rigoureuse des leviers SEO, SEA, campagnes payantes (LinkedIn, Google Ads).",
      "Aisance rédactionnelle excellente et compétences rédactionnelles irréprochables en français.",
      "Capacité à analyser la donnée de conversion et à monter des rapports d'attribution."
    ],
    responsibilities: [
      "Définir le plan de communication digital trimestriel.",
      "Piloter les budgets marketing et ajuster les coûts d'acquisition client.",
      "Rédiger et concevoir des contenus stimulants (articles, posts LinkedIn, newsletters).",
      "Assurer le suivi des indicateurs de performance clés (KPIs) et optimiser les entonnoirs."
    ],
    createdAt: "2026-06-05",
    status: "active"
  },
  {
    id: "job-4",
    title: "Développeur Alternant React Native",
    department: "Engineering",
    location: "Nantes, France",
    contractType: "Alternance",
    salary: "Selon barème légal",
    companyName: "AlphaApp Solutions",
    description: "Pour renforcer notre équipe développement mobile, nous ouvrons un poste d'alternant passionné par l'écosystème mobile et désireux d'apprendre au côté de développeurs seniors chevronnés.",
    requirements: [
      "Premiers projets d'études ou personnels réalisés en React Native / Javascript / Tailwind.",
      "Notions fondamentales sur Git, les cycles de vie des applications et la gestion d'état.",
      "Autonomie, rigueur et fort désir de monter en compétences.",
      "Rythme souhaité : idéalement 3 jours entreprise / 2 jours école."
    ],
    responsibilities: [
      "Développer et déboguer des écrans d'interfaces de notre application grand public.",
      "Collaborer à l'intégration d'APIs tierces.",
      "Assurer la mise en conformité des chartes graphiques de l'application.",
      "Participer à la rédaction de tests automatisés de base."
    ],
    createdAt: "2026-06-07",
    status: "active"
  }
];

export const INITIAL_PROFILE: CandidateProfile = {
  id: "candidate-1",
  firstName: "Thomas",
  lastName: "Dubois",
  email: "thomas.dubois@example.com",
  phone: "+33 6 12 34 56 78",
  title: "Développeur Front-End / React",
  bio: "Développeur web curieux et méticuleux avec plus de 2 ans d'expérience sur React, spécialisé en solutions d'interface rapides, esthétiques et conformes aux critères d'accessibilité numérique. Passionné par les détails typographiques et le code bien ordonné.",
  skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Git / GitHub", "Figma", "Redux"],
  experiences: [
    {
      id: "exp-1",
      company: "PixelCraft",
      role: "Développeur Logiciel Front-End",
      period: "2024 - Présent",
      description: "Conception complète de tableaux de bord financiers pour des clients d'affaires. Migration réussie de l'ancienne base webpack vers Vite, divisant le temps de construction par trois. Optimisation SEO majeure."
    },
    {
      id: "exp-2",
      company: "WebStart Agency",
      role: "Développeur Intégrateur Web",
      period: "2022 - 2023",
      description: "Intégration d'écrans adaptatifs d'e-commerce à partir de maquettes Figma. Collaboration quotidienne avec les designers produits et les chefs de projets pour la mise en ligne rapide d'interfaces."
    }
  ],
  education: [
    {
      id: "edu-1",
      school: "IUT de Nantes",
      degree: "BUT Informatique parcours Web et Mobile",
      period: "2020 - 2023"
    }
  ],
  resumeName: "Thomas_Dubois_CV.pdf",
  portfolioUrl: "https://thomasdubois.dev",
  linkedInUrl: "https://linkedin.com/in/thomasdubois"
};

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Développeur Full-Stack React & Node.js",
    candidateId: "candidate-1",
    candidateName: "Thomas Dubois",
    candidateEmail: "thomas.dubois@example.com",
    candidateTitle: "Développeur Front-End / React",
    coverLetter: "Bonjour l'équipe InnovTech Solutions !\n\nC'est avec une grande motivation que je vous soumets ma candidature pour ce poste de Développeur Full-Stack. Fort de mon expérience solide avec React et de mon intérêt croissant pour l'écosystème Node.js, je souhaite vivement mettre mes compétences à votre service.\n\nVotre plateforme d'optimisation énergétique fait écho à mes propres valeurs environnementales. Hâte d'échanger avec vous !",
    status: "interview",
    appliedAt: "2026-06-04",
    resumeName: "Thomas_Dubois_CV.pdf",
    notes: "Profil technique très intéressant. Bon contact initial. Un entretien technique est programmé."
  },
  {
    id: "app-2",
    jobId: "job-4",
    jobTitle: "Développeur Alternant React Native",
    candidateId: "candidate-1",
    candidateName: "Thomas Dubois",
    candidateEmail: "thomas.dubois@example.com",
    candidateTitle: "Développeur Front-End / React",
    coverLetter: "Bonjour,\n\nJe postule chez AlphaApp Solutions car vos projets mobiles m'intéressent beaucoup. Je souhaite apprendre l'écosystème React Native au sein de votre équipe tech dynamique.\n\nCordialement,\nThomas",
    status: "applied",
    appliedAt: "2026-06-08",
    resumeName: "Thomas_Dubois_CV.pdf"
  }
];

// LocalStorage helpers to simulate database operations safely
export function getSavedJobs(): JobOffer[] {
  const saved = localStorage.getItem("recruitment_platform_jobs");
  if (!saved) {
    localStorage.setItem("recruitment_platform_jobs", JSON.stringify(INITIAL_JOBS));
    return INITIAL_JOBS;
  }
  return JSON.parse(saved);
}

export function saveJobs(jobs: JobOffer[]): void {
  localStorage.setItem("recruitment_platform_jobs", JSON.stringify(jobs));
}

export function getSavedProfile(): CandidateProfile {
  const saved = localStorage.getItem("recruitment_platform_profile");
  if (!saved) {
    localStorage.setItem("recruitment_platform_profile", JSON.stringify(INITIAL_PROFILE));
    return INITIAL_PROFILE;
  }
  return JSON.parse(saved);
}

export function saveProfile(profile: CandidateProfile): void {
  localStorage.setItem("recruitment_platform_profile", JSON.stringify(profile));
}

export function getSavedApplications(): Application[] {
  const saved = localStorage.getItem("recruitment_platform_applications");
  if (!saved) {
    localStorage.setItem("recruitment_platform_applications", JSON.stringify(INITIAL_APPLICATIONS));
    return INITIAL_APPLICATIONS;
  }
  return JSON.parse(saved);
}

export function saveApplications(applications: Application[]): void {
  localStorage.setItem("recruitment_platform_applications", JSON.stringify(applications));
}
