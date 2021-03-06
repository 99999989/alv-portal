import { isSameMonth, setMonth, startOfToday } from 'date-fns';

export enum WorkEffortsControlPeriodFilter {
  CURRENT_MONTH = 'CURRENT_MONTH',
  LAST_3_MONTHS = 'LAST_3_MONTHS',
  LAST_6_MONTHS = 'LAST_6_MONTHS',
  LAST_12_MONTHS = 'LAST_12_MONTHS',
  ALL_MONTHS = 'ALL_MONTHS'
}

export enum WorkEffortApplyStatusFilter {
  ALL = 'ALL',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  EMPLOYED = 'EMPLOYED',
  INTERVIEW = 'INTERVIEW'
}

export interface WorkEffortsFilterValues {
  controlPeriod: WorkEffortsControlPeriodFilter;
  applyStatus: WorkEffortApplyStatusFilter;
}

export interface WorkEffortsFilter extends WorkEffortsFilterValues {
  query: string;
  ownerUserId: string;
  controlPeriod: WorkEffortsControlPeriodFilter;
  applyStatus: WorkEffortApplyStatusFilter;
}

export const initialWorkEffortsFilter = {
  query: null,
  ownerUserId: null,
  controlPeriod: WorkEffortsControlPeriodFilter.ALL_MONTHS,
  applyStatus: WorkEffortApplyStatusFilter.ALL
};

export function daysDifference(): number {
  const december: Date = setMonth(startOfToday(), 11);
  if (isSameMonth(startOfToday(), december)) {
    return 12;
  }
  return 5;
}

export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATE_TIME_FORMAT = 'dd.MM.yyyy HH:mm';
