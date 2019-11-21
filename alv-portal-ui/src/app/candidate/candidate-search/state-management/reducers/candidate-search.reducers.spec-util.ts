import {CandidateProfile} from '../../../../shared/backend-services/candidate/candidate.types';
import {
  Availability,
  CEFR_Level,
  Degree,
  Experience,
  Gender,
  Graduation,
  ISCED_1997
} from '../../../../shared/backend-services/shared.types';

export function createCandidateProfile(id = 'id'): CandidateProfile {
  return {
    id: id,
    gender: Gender.MALE,
    availability: Availability.IMMEDIATE,
    externalId: id + id,
    residenceCantonCode: 'ZH',
    workLoad: 100,
    isPublic: true,
    isProtected: true,
    showProtectedData: true,
    workForm: [],
    preferredWorkRegions: [],
    preferredWorkCantons: ['TG', 'SG', 'GL', 'ZH', 'AG', 'ZG'],
    jobExperiences: [{
      occupation: { avamCode: 69207, bfsCode: 33302009, sbn3Code: 361, sbn5Code: 36102, chIsco5Code: 25140, chIsco3Code: 251 },
      experience: Experience.MORE_THAN_3_YEARS,
      graduation: Graduation.CH,
      degree: Degree.TER_MASTER_FACHHOCHSCHULE,
      education: ISCED_1997.ISCED5,
      remark: null,
      wanted: true,
      lastJob: false
    }, {
      occupation: { avamCode: 69211, bfsCode: 33301004, sbn3Code: 361, sbn5Code: 36101, chIsco5Code: 25140, chIsco3Code: 251 },
      experience: Experience.MORE_THAN_1_YEAR,
      graduation: Graduation.CH,
      degree: Degree.TER_BACHELOR_FACHHOCHSCHULE,
      education: ISCED_1997.ISCED5,
      remark: null,
      wanted: true,
      lastJob: false
    }, {
      occupation: { avamCode: 15076, bfsCode: 33301058, sbn3Code: 361, sbn5Code: 36101, chIsco5Code: 25140, chIsco3Code: 251 },
      experience: Experience.MORE_THAN_3_YEARS,
      graduation: Graduation.CH,
      degree: Degree.TER_MASTER_FACHHOCHSCHULE,
      education: ISCED_1997.ISCED5,
      remark: null,
      wanted: true,
      lastJob: true
    }],
    languages: [{
      code: 'de',
      writtenLevel: CEFR_Level.PROFICIENT,
      spokenLevel: CEFR_Level.PROFICIENT
    }, {
      code: 'fr',
      writtenLevel: CEFR_Level.INTERMEDIATE,
      spokenLevel: CEFR_Level.INTERMEDIATE
    }, {
      code: 'en',
      writtenLevel: CEFR_Level.PROFICIENT,
      spokenLevel: CEFR_Level.PROFICIENT
    }],
    drivingCategories: ['A', 'B'],
    highestEducationLevel: 'ISCED5',
    highestDegree: null,
    jobCenterCode: null,
    jobAdvisor: null
  };
}
