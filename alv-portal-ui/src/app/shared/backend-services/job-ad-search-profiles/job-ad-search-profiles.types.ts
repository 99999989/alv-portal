import { CantonSuggestion } from '../reference-service/locality.types';
import { Location } from '../job-advertisement/job-advertisement.types';
import {
  CantonFilter,
  ContractType,
  OccupationFilter,
  OccupationResolved,
  Sort
} from '../shared.types';

export interface JobAdSearchProfilesSearchResponse {
  totalCount: number;
  result: JobAdSearchProfileResult[];
}

export interface ResolvedJobAdSearchProfile {
  id?: string;
  name: string;
  ownerUserId: string;
  createdTime?: Date;
  updatedTime?: Date;
  searchFilter: ResolvedJobSearchFilter;
}

export interface CreateJobAdSearchProfile {
  name: string;
  ownerUserId?: string;
  searchFilter?: JobSearchFilterRequest;
}

export interface UpdateJobAdSearchProfile {
  name: string;
  searchFilter?: JobSearchFilterRequest;
}

export interface JobAdSearchProfileResult {
  id?: string;
  name: string;
  createdTime?: Date;
}

export interface ResolvedJobSearchFilter {
  sort: Sort;
  displayRestricted: boolean;
  contractType: ContractType;
  workloadPercentageMax: string;
  workloadPercentageMin: string;
  companyName?: string;
  onlineSince: string;
  occupations: OccupationResolved[];
  locations: LocationResolved[];
  cantons: CantonSuggestion[];
  keywords: string[];
  distance?: number;
}

export interface JobSearchFilterRequest {
  sort: Sort;
  displayRestricted: boolean;
  contractType: ContractType;
  workloadPercentageMax: number;
  workloadPercentageMin: number;
  companyName?: string;
  onlineSince: number;
  occupationFilters: OccupationFilter[];
  localityFilters: LocalityFilter[];
  cantonFilters: CantonFilter[];
  keywords: string[];
  distance?: number;
}

export interface LocationResolved extends Location {
  id: string;
}

export interface LocalityFilter {
  localityId: string;
}

export enum SearchProfileErrors {
  PROFILE_ALREADY_EXISTS = 'http://www.job-room.ch/job-ad-service/problem/search-profile/already-exists'
}
