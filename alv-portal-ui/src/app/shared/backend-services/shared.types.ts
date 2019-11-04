import { Languages } from '../../core/languages.constants';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CompetenceCatalogAction } from '../../competence-catalog/shared/shared-competence-catalog.types';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface Contact {
  salutation?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export enum CEFR_Level {
  NONE = 'NONE',
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  PROFICIENT = 'PROFICIENT'
}

export enum Qualification {
  SKILLED = 'SKILLED',
  SEMISKILLED = 'SEMISKILLED',
  UNSKILLED = 'UNSKILLED'
}

/**
 * the numbers here correspond to a code of the education in the avam database
 */
export enum Degree {
  SEK_II_WEITERFUEHRENDE_SCHULE = '130',
  SEK_II_GRUNDBILDUNG_EBA = '131',
  SEK_II_GRUNDBILDUNG_EFZ = '132',
  SEK_II_FACHMITTELSCHULE = '133',
  SEK_II_BERUFSMATURITAET = '134',
  SEK_II_FACHMATURITAET = '135',
  SEK_II_GYMNASIALE_MATURITAET = '136',
  TER_BERUFSBILDUNG_DIPL = '150',
  TER_BERUFSBILDUNG_FA = '160',
  TER_BACHELOR_FACHHOCHSCHULE = '170',
  TER_BACHELOR_UNIVERSITAET = '171',
  TER_MASTER_FACHHOCHSCHULE = '172',
  TER_MASTER_UNIVERSITAET = '173',
  TER_DOKTORAT_UNIVERSITAET = '180'
}

export const DegreeMapping = {
  '130': 'SEK_II_WEITERFUEHRENDE_SCHULE',
  '131': 'SEK_II_GRUNDBILDUNG_EBA',
  '132': 'SEK_II_GRUNDBILDUNG_EFZ',
  '133': 'SEK_II_FACHMITTELSCHULE',
  '134': 'SEK_II_BERUFSMATURITAET',
  '135': 'SEK_II_FACHMATURITAET',
  '136': 'SEK_II_GYMNASIALE_MATURITAET',
  '150': 'TER_BERUFSBILDUNG_DIPL',
  '160': 'TER_BERUFSBILDUNG_FA',
  '170': 'TER_BACHELOR_FACHHOCHSCHULE',
  '171': 'TER_BACHELOR_UNIVERSITAET',
  '172': 'TER_MASTER_FACHHOCHSCHULE',
  '173': 'TER_MASTER_UNIVERSITAET',
  '180': 'TER_DOKTORAT_UNIVERSITAET'
};


export enum Experience {
  LESS_THAN_1_YEAR = 'LESS_THAN_1_YEAR',
  MORE_THAN_1_YEAR = 'MORE_THAN_1_YEAR',
  MORE_THAN_3_YEARS = 'MORE_THAN_3_YEARS'
}

export enum Availability {
  IMMEDIATE = 'IMMEDIATE',
  BY_ARRANGEMENT = 'BY_ARRANGEMENT'
}

export enum WorkForm {
  SUNDAY_AND_HOLIDAYS = 'SUNDAY_AND_HOLIDAYS',
  SHIFT_WORK = 'SHIFT_WORK',
  NIGHT_WORK = 'NIGHT_WORK',
  HOME_WORK = 'HOME_WORK'
}

export enum ISCED_1997 {
  ISCED1, ISCED2, ISCED3, ISCED4, ISCED5, ISCED6
}

export enum Graduation {
  CH = 'CH',
  ACCEPTED = 'ACCEPTED',
  NOT_ACCEPTED = 'NOT_ACCEPTED',
  NONE = 'NONE'
}

export enum DrivingLicenceCategory {
  A = 'A',
  A1 = 'A1',
  B = 'B',
  B1 = 'B1',
  BE = 'BE',
  C = 'C',
  C1 = 'C1',
  C1E = 'C1E',
  CE = 'CE',
  D = 'D',
  D1 = 'D1',
  D1E = 'D1E',
  DE = 'DE',
  F = 'F',
  G = 'G',
  M = 'M'
}

export enum Canton {
  AG = 'AG',
  AI = 'AI',
  AR = 'AR',
  BE = 'BE',
  BL = 'BL',
  BS = 'BS',
  FR = 'FR',
  GE = 'GE',
  GL = 'GL',
  GR = 'GR',
  JU = 'JU',
  LU = 'LU',
  NE = 'NE',
  NW = 'NW',
  OW = 'OW',
  SG = 'SG',
  SH = 'SH',
  SO = 'SO',
  SZ = 'SZ',
  TG = 'TG',
  TI = 'TI',
  UR = 'UR',
  VD = 'VD',
  VS = 'VS',
  ZG = 'ZG',
  ZH = 'ZH'
}

export enum Language {
  DE = 'de',
  FR = 'fr',
  IT = 'it',
  EN = 'en',
  DE_CH = 'de-ch',
  AR = 'ar',
  BG = 'bg',
  BS = 'bs',
  CS = 'cs',
  DA = 'da',
  EL = 'el',
  ES = 'es',
  FA = 'fa',
  FI = 'fi',
  HE = 'he',
  HR = 'hr',
  HU = 'hu',
  JA = 'ja',
  KM = 'km',
  KU = 'ku',
  LT = 'lt',
  MK = 'mk',
  NL = 'nl',
  NLD = 'nld',
  NO = 'no',
  PL = 'pl',
  PRS = 'prs',
  PT = 'pt',
  RM = 'rm',
  RO = 'ro',
  RU = 'ru',
  SK = 'sk',
  SL = 'sl',
  SQ = 'sq',
  SR = 'sr',
  SR_HR = 'sr-hr',
  SV = 'sv',
  TA = 'ta',
  TH = 'th',
  TI = 'ti',
  TR = 'tr',
  VI = 'vi',
  ZH = 'zh'
}

export enum Salutation {
  MS = 'ms',
  MR = 'mr'
}

export interface PostAddress {
  name: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  postOfficeBoxNumber?: string;
  postOfficeBoxPostalCode?: string;
  postOfficeBoxCity?: string;
  countryIsoCode?: string;
}

export interface LanguageSkill {
  languageIsoCode: string;
  nativeLanguage?: boolean;
  spokenLevel: CEFR_Level;
  writtenLevel: CEFR_Level;
}

export enum EmploymentDuration {
  PERMANENT = 'permanent',
  TEMPORARY = 'temporary',
  SHORT_EMPLOYMENT = 'short-employment'
}

export enum Sort {
  RELEVANCE_DESC = 'RELEVANCE_DESC',
  DATE_DESC = 'DATE_DESC',
  DATE_ASC = 'DATE_ASC'
}

export enum ContractType {
  ALL = 'ALL',
  TEMPORARY = 'TEMPORARY',
  PERMANENT = 'PERMANENT',
}

export interface Page<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: PageableSort;
  pageable: Pageable;
}

export interface PageableSort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: PageableSort;
}

export interface OccupationResolved {
  id: string;
  code: string;
  type: string;
  filterType: string;
  label: string;
  mappings?: { [key: string]: string };
}

export interface CantonFilter {
  name: string;
  code: string;
}

export interface OccupationFilter {
  labelId: string;
}

export interface SearchProfile {
  id: string;
  name: string;
}

export interface ActionDefinition<T> {
  name: T;
  icon?: IconProp;
  label?: string;
}
