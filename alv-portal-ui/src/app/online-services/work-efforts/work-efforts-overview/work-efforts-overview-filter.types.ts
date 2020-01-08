export enum WorkEffortsFilterPeriod {
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
  period: WorkEffortsFilterPeriod;
  workEffortResult: WorkEffortApplyStatusFilter;
}

export interface WorkEffortsFilter extends WorkEffortsFilterValues {
  query: string;
  period: WorkEffortsFilterPeriod;
  workEffortResult: WorkEffortApplyStatusFilter;
}

export const initialWorkEffortsFilter = {
  query: null,
  period: WorkEffortsFilterPeriod.ALL_MONTHS,
  workEffortResult: WorkEffortApplyStatusFilter.ALL
};
