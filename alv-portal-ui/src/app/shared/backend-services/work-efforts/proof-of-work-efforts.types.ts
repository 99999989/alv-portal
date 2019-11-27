export interface ProofOfWorkEfforts {
  id?: string;
  businessCaseId: string;
  controlPeriod: ControlPeriod;
  endDate: string;
  startDate: string;
  firstName: string;
  lastName: string;
  ownerUserId: string;
  personNumber: string;
  workEfforts: WorkEffort[];
  status: ProofOfWorkEffortsStatus;
  nextSubmissionDate: string;
  lastSubmittedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  documentId?: string;
}

export interface WorkEffort {
  id?: string;
  occupation: string;
  applyDate: string;
  applyStatus: WorkEffortApplyStatus[];
  applyChannel: WorkEffortApplyChannel;
  ravAssigned: boolean;
  fullTimeJob: boolean;
  rejectionReason?: string;
  submittedAt?: string; // if null, then edit is possible
  createdAt?: string;
}

export interface WorkEffortApplyChannel {
  address: WorkEffortApplyChannelAddress;
  contactPerson: string;
  email: string;
  formUrl: string;
  phone: string;
  types: WorkEffortApplyChannelType[];
}

export interface WorkEffortApplyChannelAddress {
  city: string;
  country: string;
  houseNumber: string;
  name: string;
  poBox: string;
  postalCode: string;
  street: string;
}

export interface ControlPeriod {
  type: ControlPeriodType;
  value: string;
}

export enum ProofOfWorkEffortsStatus {
  RE_OPENED = 'RE_OPENED',
  SUBMITTED = 'SUBMITTED',
  OPEN = 'OPEN'
}

export enum ControlPeriodType {
  DURING_UNEMPLOYMENT = 'DURING_UNEMPLOYMENT',
  BEFORE_UNEMPLOYMENT = 'BEFORE_UNEMPLOYMENT'
}

export enum WorkEffortApplyChannelType {
  ELECTRONIC = 'ELECTRONIC',
  MAIL = 'MAIL',
  PERSONAL = 'PERSONAL',
  PHONE = 'PHONE'

}

export enum WorkEffortApplyStatus {
  PENDING = 'PENDING',
  INTERVIEW = 'INTERVIEW',
  EMPLOYED = 'EMPLOYED',
  REJECTED = 'REJECTED'
}

export enum ProofOfWorkEffortsErrors {
  NO_MATCHING_PROOF_OF_WORK_EFFORT_FOUND = 'NO_MATCHING_PROOF_OF_WORK_EFFORT_FOUND'
}
