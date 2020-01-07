import {CandidateProfile, JobExperience, LanguageSkill, Occupation} from './candidate.types';
import {Availability, CEFR_Level, Degree, Experience, Gender, Graduation, ISCED_1997} from '../shared.types';

export const mockOccupation: Occupation = {
  avamCode: 2323,
  bfsCode: 12123,
  chIsco5Code: 25140,
  chIsco3Code: 251
};


export const mockJobExperience: JobExperience = {
    occupation: mockOccupation,
    experience: Experience.LESS_THAN_1_YEAR,
    graduation: Graduation.ACCEPTED,
    degree: Degree.SEK_II_BERUFSMATURITAET,
    education: ISCED_1997.ISCED1,
    remark: 'string',
    lastJob: true,
    wanted: true
  }
;

export const languageSkillMock: LanguageSkill = {
  code: 'ru',
  spokenLevel: CEFR_Level.BASIC,
  writtenLevel: CEFR_Level.INTERMEDIATE
};

export const mockCandidateProfile: CandidateProfile = {
  id: 'something',
  gender: Gender.FEMALE,
  availability: Availability.IMMEDIATE,
  externalId: 'something',
  residenceCantonCode: 'something',
  workLoad: 100,
  isPublic: true,
  isProtected: true,
  showProtectedData: true,
  workForm: ['one', 'two'],
  preferredWorkRegions: ['one', 'two'],
  preferredWorkCantons: ['one', 'two'],
  jobExperiences: [mockJobExperience],
  languages: [languageSkillMock],
  drivingCategories: ['one', 'two'],
  highestEducationLevel: 'something',
  highestDegree: 'something',
  jobCenterCode: 'something',
  jobAdvisor: null,
  contactTypes: ['one', 'two'],
};
