export type OpportunityCategory =
  | 'scholarships'
  | 'internships'
  | 'hackathons'
  | 'certifications'
  | 'schemes';

export interface Opportunity {
  id: string;
  title: string;
  titleMl: string;
  category: OpportunityCategory;
  provider: string;
  description: string;
  descriptionMl: string;
  longDescription: string;
  longDescriptionMl: string;
  district: string; // 'all' or district key
  districtNameEn: string;
  districtNameMl: string;
  branchEligibility: string[]; // ['all'] or specific branch keys
  courseEligibility: string[]; // ['undergraduate', 'diploma', 'pg']
  yearEligibility: string[]; // ['1', '2', '3', '4', 'final']
  tags: string[];
  tagsMl?: string[];
  awardOrStipend: string;
  awardOrStipendMl?: string;
  deadlineDate: string; // e.g. "2026-10-15"
  daysLeft: number;
  applicationUrl: string;
  featured?: boolean;
  mode: 'Online / Remote' | 'Hybrid' | 'On-Campus';
  modeMl: 'ഓൺലൈൻ / റിമോട്ട്' | 'ഹൈബ്രിഡ്' | 'ഓൺ-ക്യാമ്പസ്';
  perks: string[];
  perksMl: string[];
  stepsToApply: string[];
  stepsToApplyMl: string[];

  // Institution / Verification extensions
  status?: 'pending' | 'approved' | 'rejected';
  institutionName?: string;
  isVerifiedPartner?: boolean;
  postedByEmail?: string;
  supportingDocName?: string;
  submittedAt?: string;

  // Cached AI Summary if available
  aiSummary?: {
    eligible: string;
    requirements: string;
    deadline: string;
    restrictions: string;
  };
}

export interface StudentProfile {
  name: string;
  course: string; // 'undergraduate' | 'diploma' | 'pg'
  branch: string; // 'computer-science' | 'engineering' | 'commerce' | 'science' | 'arts' | 'health'
  year: string; // '1' | '2' | '3' | '4' | 'final'
  college: string;
  district: string; // e.g. 'kochi', 'thiruvananthapuram'
  interests: string[];
}

export interface PortfolioProject {
  title: string;
  techStack: string;
  relevance: string;
  description: string;
  link?: string;
}

export interface GeneratedPortfolio {
  fullName: string;
  targetOpportunityTitle: string;
  headline: string;
  summary: string;
  keySkills: string[];
  matchingStrengths: string[];
  projects: PortfolioProject[];
  achievements: string[];
  contactInfo: {
    email?: string;
    college?: string;
    branch?: string;
    district?: string;
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  callToAction: string;
}

export interface InstitutionUser {
  id: string;
  name: string;
  type: 'college' | 'company' | 'government' | 'incubator';
  email: string;
  domain: string;
  verified: boolean;
  district: string;
  website?: string;
  contactPerson?: string;
}

export type ViewRoute = 'home' | 'dashboard' | 'saved' | 'about' | 'profile' | 'institution';

export type Language = 'en' | 'ml';

export type Theme = 'light' | 'dark';
