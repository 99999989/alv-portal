import {
  Degree,
  LanguageSkill,
  PostAddress,
  Qualification,
  Salutation
} from '../shared.types';
import { GeoPoint } from '../reference-service/locality.types';

export enum JobAdvertisementStatus {
  CREATED = 'CREATED',
  INSPECTING = 'INSPECTING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REFINING = 'REFINING',
  PUBLISHED_RESTRICTED = 'PUBLISHED_RESTRICTED',
  PUBLISHED_PUBLIC = 'PUBLISHED_PUBLIC',
  NOT_PUBLISHED = 'NOT_PUBLISHED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED',
}

export enum CancellationReason {
  OCCUPIED_JOBCENTER = 'OCCUPIED_JOBCENTER',
  OCCUPIED_AGENCY = 'OCCUPIED_AGENCY',
  OCCUPIED_JOBROOM = 'OCCUPIED_JOBROOM',
  OCCUPIED_OTHER = 'OCCUPIED_OTHER',
  NOT_OCCUPIED = 'NOT_OCCUPIED',
  CHANGE_OR_REPOSE = 'CHANGE_OR_REPOSE'
}

export enum SourceSystem {
  JOBROOM = 'JOBROOM',
  API = 'API',
  RAV = 'RAV',
  EXTERN = 'EXTERN'
}

export enum WorkExperience {
  NO_EXPERIENCE = 'NO_EXPERIENCE',
  LESS_THAN_1_YEAR = 'LESS_THAN_1_YEAR',
  MORE_THAN_1_YEAR = 'MORE_THAN_1_YEAR',
  MORE_THAN_3_YEARS = 'MORE_THAN_3_YEARS'
}

export interface JobContent {
  externalUrl?: string;
  jobDescriptions: JobDescription[];
  company: Company;
  employer?: Employer;
  employment: Employment;
  location: Location;
  occupations?: Occupation[];
  languageSkills: LanguageSkill[];
  applyChannel: ApplyChannel;
  publicContact?: PublicContact;
  numberOfJobs: string;
}

export interface JobAdvertisement {
  id: string;
  createdTime?: string; //date string
  updatedTime?: string; //date string
  status: JobAdvertisementStatus;
  sourceSystem: SourceSystem;
  owner: {
    companyId: string;
    userDisplayName: string;
    userId: string
  };
  externalReference: string;
  stellennummerEgov: string;
  stellennummerAvam: string;
  fingerprint: string;
  reportingObligation?: boolean;
  reportingObligationEndDate?: string;
  reportToAvam: boolean;
  jobCenterCode: string;
  approvalDate?: string;
  rejectionDate?: string;
  rejectionCode?: string;
  rejectionReason?: string;
  cancellationDate?: string;
  cancellationCode?: string;
  jobContent: JobContent;
  publication: Publication;
}


export interface Publication {
  startDate: string;
  endDate?: string;
  euresDisplay: boolean;
  euresAnonymous?: boolean;
  publicDisplay: boolean;
  restrictedDisplay?: boolean;
  companyAnonymous?: boolean;
}

export interface JobDescription {
  languageIsoCode: string;
  title: string;
  description: string;
}

export interface Company {
  name: string;
  street: string;
  houseNumber?: string;
  postalCode: string;
  city: string;
  countryIsoCode: string;
  postOfficeBoxNumber?: string;
  postOfficeBoxPostalCode?: string;
  postOfficeBoxCity?: string;
  phone?: string;
  email?: string;
  website?: string;
  surrogate?: boolean;
}

export interface Employer {
  name: string;
  postalCode: string;
  city: string;
  countryIsoCode: string;
}

export interface Employment {
  startDate?: string;
  endDate?: string;
  shortEmployment: boolean;
  immediately: boolean;
  permanent: boolean;
  workloadPercentageMin: number;
  workloadPercentageMax: number;
  workForms?: string[];
}

export interface Location {
  id?: string;
  remarks?: string;
  city: string;
  postalCode: string;
  countryIsoCode: string;
  communalCode?: string;
  regionCode?: string;
  cantonCode?: string;
  coordinates?: GeoPoint;
}

export interface CreateLocation {
  remarks?: string;
  city: string;
  postalCode: string;
  countryIsoCode: string;
}

export interface Occupation {
  avamOccupationCode: string;
  occupationLabel?: string;
  qualificationCode?: Qualification;
  workExperience?: WorkExperience;
  educationCode?: Degree;
}

export interface ApplyChannel {
  postAddress: PostAddress;
  rawPostAddress: string;
  emailAddress: string;
  phoneNumber: string;
  formUrl: string;
  additionalInfo: string;
}

export interface Contact {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  languageIsoCode: string;
}

export interface PublicContact {
  salutation: Salutation;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface CreateJobAdvertisement {
  reportToAvam: boolean;
  externalUrl?: string;
  contact: Contact;
  publication: Publication;
  numberOfJobs: string;
  jobDescriptions: JobDescription[];
  company: WebformCompany;
  employer: Employer;
  employment: Employment;
  location: CreateLocation;
  occupation: Occupation;
  languageSkills: LanguageSkill[];
  applyChannel: WebformApplyChannel;
  publicContact: PublicContact;
}

export interface ManageJobAdsSearchBody {
  keywordsText: string;
  onlineSinceDays: number;
  companyId: string;
  ownerUserId: string;
  state: JobAdvertisementStatus;
}

export interface ManagedJobAdsSearchRequest {
  page: number;
  size: number;
  sort: string;
  body: ManageJobAdsSearchBody;
}

export interface ManagedJobAdsSearchResponse {
  totalCount: number;
  result: JobAdvertisement[];
}

export interface JobAdvertisementSearchResponse {
  totalCount: number;
  result: JobAdvertisementWithFavourites[];
}

export interface JobAdFavouritesSearchResponse {
  totalCount: number;
  result: JobAdvertisementWithFavourites[];
}

export interface JobAdFavouritesSearchRequest {
  page: number;
  size: number;
  body: JobAdFavouritesSearchBody;
}

export interface JobAdFavouritesSearchBody {
  query: string;
}

export interface FavouriteItem {
  id: string;
  createdTime: string; //date string
  updatedTime: string; //date string
  note: string | null;
  jobAdvertisementId: string;
  ownerId: string;
}

export interface CreateFavouriteItem {
  note: string;
  userId: string; //the id of the person who adds the job to his favourites
  jobAdvertisementId: string;
}

export interface JobAdvertisementWithFavourites {
  jobAdvertisement: JobAdvertisement;
  favouriteItem: FavouriteItem | null;
}

export interface ProfessionCode {
  type: string;
  value: string;
}

export interface JobAdvertisementSearchRequestBody {
  language?: string;
  professionCodes?: ProfessionCode[];
  keywords?: string[];
  communalCodes?: string[];
  regionCodes?: string[];
  cantonCodes?: string[];
  workloadPercentageMin?: number;
  workloadPercentageMax?: number;
  permanent?: boolean;
  companyName?: string;
  onlineSince: number;
  displayRestricted: boolean;
  radiusSearchRequest?: RadiusSearchRequest;
}

export interface RadiusSearchRequest {
  geoPoint: GeoPointDto;
  distance: number;
}

export interface GeoPointDto {
  lon: number;
  lat: number;
}

export interface JobAdvertisementSearchRequest {
  page: number;
  size: number;
  sort?: string;
  body: JobAdvertisementSearchRequestBody;
}

export interface JobAdvertisementCancelRequest {
  id: string;
  token?: string;
  code: CancellationReason;
}

export interface WebformCompany {
  name: string;
  street?: string;
  houseNumber?: string;
  postOfficeBoxNumber?: string;
  postalCode: string;
  city: string;
  countryIsoCode: string;
  surrogate?: boolean;
}

export interface WebformApplyChannel {
  postAddress: WebformPostAddress;
  emailAddress: string;
  phoneNumber: string;
  formUrl: string;
  additionalInfo: string;
}

export interface WebformPostAddress {
  name: string;
  street?: string;
  houseNumber?: string;
  postOfficeBoxNumber?: string;
  postalCode: string;
  city: string;
  countryIsoCode: string;
}
