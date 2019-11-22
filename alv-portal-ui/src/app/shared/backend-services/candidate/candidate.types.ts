import {Availability, CEFR_Level, Contact, Degree, Experience, Gender, Graduation, ISCED_1997} from '../shared.types';
import {OccupationCode} from '../reference-service/occupation-label.types';

export interface CandidateSearchRequest {
  page: number;
  size: number;
  sort?: string;
  body: CandidateSearchRequestBody;
}

export interface CandidateSearchResponse {
  totalCount: number;
  result: CandidateProfile[];
}

export interface CandidateSearchRequestBody {
  occupationCodes: OccupationCode[];
  skills: string[];
  experience: string;
  workplace?: string;
  residence: string[];
  cantonCode: string;
  regionCode: string;
  availability: string;
  workLoad: WorkLoad;
  workForm: string;
  degree: string;
  graduation: string;
  drivingLicenceCategory: string;
  languageSkills: FilterLanguageSkill[];
}

export interface WorkLoad {
  min: number;
  max: number;
}

export interface CandidateProtectedData {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  mobile: string;
  address: Address;
  nationalityCode: string;
  candidateProfile: CandidateProfile;
}

export interface CandidateProfile {
  id: string;
  gender: Gender;
  availability: Availability;
  externalId: string;
  residenceCantonCode: string;
  workLoad: number;
  isPublic: boolean;
  isProtected: boolean;
  showProtectedData: boolean;
  workForm: string[];
  preferredWorkRegions: string[];
  preferredWorkCantons: string[];
  jobExperiences: JobExperience[];
  languages: LanguageSkill[];
  drivingCategories: string[];
  highestEducationLevel: string;
  highestDegree: string;
  jobCenterCode: string;
  jobAdvisor: Contact;
  contactTypes?: string[];
}

/**
 * pay attention that this language skills is different from the one used for jobads
 *
 * this is due to a technical debt on the server
 */
export interface LanguageSkill {
  code: string;
  spokenLevel: CEFR_Level;
  writtenLevel: CEFR_Level;
}

/**
 * pay attention that this the language skill FilterLanguageSkill is used for POST filtering queries is different
 * from the we receive from the backend.
 *
 * this is due to a technical debt on the server
 */
export interface FilterLanguageSkill {
  code: string;
  spoken: CEFR_Level;
  written: CEFR_Level;
}

export interface Address {
  street: string;
  zipCode: string;
  city: string;
}

export interface JobExperience {
  occupation: Occupation;
  experience: Experience;
  graduation: Graduation;
  degree: Degree;
  education: ISCED_1997;
  remark: string;
  lastJob: boolean;
  wanted: boolean;
}

export interface Occupation {
  avamCode: number;
  bfsCode: number;
  chIsco3Code: number;
  chIsco5Code: number;
}

export interface EmailContactModal {
  candidateId: string;
  subject: string;
  personalMessage: string;
  companyName: string;
  phone?: string;
  email?: string;
  company?: Company;
}

export interface Company {
  name: string;
  contactPerson: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
}
