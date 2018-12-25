import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  Availability,
  Canton,
  Degree,
  DrivingLicenceCategory,
  Experience,
  Graduation,
  LanguageSkill,
  WorkForm
} from '../../../shared/backend-services/shared.types';
import { CandidateProfile } from '../../../shared/backend-services/candidate/candidate.types';
import { OccupationMultiTypeaheadItem } from '../../../shared/occupations/occupation-multi-typeahead-item';
import { SimpleMultiTypeaheadItem } from '../../../shared/forms/input/multi-typeahead/simple-multi-typeahead.item';


export interface CandidateSearchState {
  totalCount: number;
  page: number;
  candidateSearchFilter: CandidateSearchFilter;
  resultList: CandidateProfile[];
  selectedCandidateProfile: CandidateProfile;
  resultsAreLoading: boolean;
  visitedCandidates: { [id: string]: boolean; };
}

export const initialState: CandidateSearchState = {
  totalCount: 0,
  page: 0,
  candidateSearchFilter: {
    occupations: [],
    skills: [],
    workplace: [],
    experience: null,
    residence: [],
    availability: null,
    workloadPercentageMin: 0,
    workloadPercentageMax: 100,
    workForm: null,
    degree: null,
    graduation: null,
    drivingLicenceCategory: null,
    languageSkills: []
  },
  resultList: [],
  selectedCandidateProfile: null,
  resultsAreLoading: false,
  visitedCandidates: {}
};

export interface CandidateSearchFilter {
  // todo: implement
  occupations: OccupationMultiTypeaheadItem[];
  skills: OccupationMultiTypeaheadItem[];
  workplace: SimpleMultiTypeaheadItem[];
  experience: Experience;
  residence: Canton[];
  availability: Availability;
  workloadPercentageMin: number;
  workloadPercentageMax: number;
  workForm: WorkForm;
  degree: Degree;
  graduation: Graduation;
  drivingLicenceCategory: DrivingLicenceCategory;
  languageSkills: LanguageSkill[];
}

export interface CandidateSearchResult {
  candidateProfile: CandidateProfile;
  visited: boolean;
}

export const getCandidateSearchState = createFeatureSelector<CandidateSearchState>('candidateSearch');

export const getCandidateSearchFilter = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.candidateSearchFilter);

export const getTotalCount = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.totalCount);

export const getResultList = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.resultList);

export const getVisitedCandidates = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.visitedCandidates);

export const getResultsAreLoading = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.resultsAreLoading);

export const getSelectedCandidateProfile = createSelector(getCandidateSearchState, (state: CandidateSearchState) => state.selectedCandidateProfile);


export const getCandidateSearchResults = createSelector(getResultList, getVisitedCandidates, (resultList, visitedCandidates) => {
  return resultList.map((candidateProfile) => {
    return {
      candidateProfile: candidateProfile,
      visited: visitedCandidates[candidateProfile.id] || false
    };
  });
});

export const getPrevId = createSelector(getResultList, getSelectedCandidateProfile, (resultList, current) => {
  if (current) {
    const ids = resultList.map((item) => item.id);
    const idx = ids.findIndex(id => id === current.id);

    return idx > 0 ? ids[idx - 1] : null;
  }

  return null;
});

export const getNextId = createSelector(getResultList, getSelectedCandidateProfile, (resultList, current) => {
  if (current) {
    const ids = resultList.map((item) => item.id);
    const idx = ids.findIndex(id => id === current.id);

    return idx < ids.length - 1 ? ids[idx + 1] : null;
  }

  return null;
});

export const isPrevVisible = createSelector(getResultList, getSelectedCandidateProfile, (resultList, selectedCandidateProfile) => {
  if (selectedCandidateProfile) {
    return resultList
      .map((item) => item.id)
      .findIndex(id => id === selectedCandidateProfile.id) > 0;
  }

  return false;
});

export const isNextVisible = createSelector(getResultList, getSelectedCandidateProfile, getTotalCount, (resultList, current, totalCount) => {
  if (current) {
    return resultList
      .map((item) => item.id)
      .findIndex(id => id === current.id) < totalCount - 1;
  }

  return false;
});
