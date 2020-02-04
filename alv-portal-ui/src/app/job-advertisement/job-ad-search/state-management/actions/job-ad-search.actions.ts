import { Action } from '@ngrx/store';
import {
  FavouriteItem,
  JobAdvertisement,
  JobAdvertisementWithFavourites
} from '../../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { JobSearchFilter } from '../state';
import { FilterPanelValues } from '../../job-search/filter-panel/filter-panel.component';
import { JobQueryPanelValues } from '../../../../widgets/job-search-widget/job-query-panel/job-query-panel-values';
import { OccupationTypeaheadItem } from '../../../../shared/occupations/occupation-typeahead-item';
import {
  AddedJobAdFavouriteAction,
  AddJobAdFavouriteAction,
  EffectErrorOccurredAction,
  RemovedJobAdFavouriteAction,
  RemoveJobAdFavouriteAction,
  UpdatedJobAdFavouriteAction
} from '../../../../core/state-management/actions/core.actions';
import { ResolvedJobAdSearchProfile } from '../../../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.types';

export const INITIALIZE_RESULT_LIST = 'JOBS:INITIALIZE_RESULT_LIST';
export const RESULT_LIST_ALREADY_INITIALIZED = 'JOBS:RESULT_LIST_ALREADY_INITIALIZED';
export const FILTER_APPLIED = 'JOBS:FILTER_APPLIED';
export const APPLY_FILTER = 'JOBS:APPLY_FILTER';
export const RESET_FILTER = 'JOBS:RESET_FILTER';
export const FILTER_RESET = 'JOBS:FILTER_RESET';
export const LOAD_NEXT_PAGE = 'JOBS:LOAD_NEXT_PAGE';
export const NEXT_PAGE_LOADED = 'JOBS:NEXT_PAGE_LOADED';
export const NEXT_PAGE_NOT_AVAILABLE = 'JOBS:NEXT_PAGE_NOT_AVAILABLE';

export const JOB_ADVERTISEMENT_DETAIL_LOADED = 'JOBS:JOB_ADVERTISEMENT_DETAIL_LOADED';
export const JOB_ADVERTISEMENT_DETAIL_UNLOADED = 'JOBS:JOB_ADVERTISEMENT_DETAIL_UNLOADED';

export const LOAD_PREVIOUS_JOB_ADVERTISEMENT_DETAIL = 'JOBS:LOAD_PREVIOUS_JOB_ADVERTISEMENT_DETAIL';
export const LOAD_NEXT_JOB_ADVERTISEMENT_DETAIL = 'JOBS:LOAD_NEXT_JOB_ADVERTISEMENT_DETAIL';

export const APPLY_QUERY_VALUES = 'JOBS:APPLY_QUERY_VALUES';
export const APPLY_FILTER_VALUES = 'JOBS:APPLY_FILTER_VALUES';

export const OCCUPATION_LANGUAGE_CHANGED_ACTION = 'JOBS:OCCUPATION_LANGUAGE_CHANGED_ACTION';

export const RESET = 'JOBS:RESET';

export const FAVOURITE_ITEM_LOADED = 'JOBS:FAVOURITE_ITEM_LOADED';

export const SEARCH_PROFILE_UPDATED = 'JOBS:SEARCH_PROFILE_UPDATED';

export const JOB_ALERT_TOGGLED = 'JOBS:JOB_ALERT_TOGGLED';


export class InitializeResultListAction implements Action {
  readonly type = INITIALIZE_RESULT_LIST;

  constructor(public payload = {}) {
  }
}

export class ResultListAlreadyInitializedAction implements Action {
  readonly type = RESULT_LIST_ALREADY_INITIALIZED;

  constructor(public payload = {}) {
  }
}

/**
 * Action to reset the current filter to it's initial state
 */
export class ResetFilterAction implements Action {
  readonly type = RESET_FILTER;

  constructor(public payload: {}) {
  }
}

/**
 * Action after a filter has been reset
 */
export class FilterResetAction implements Action {
  readonly type = FILTER_RESET;

  constructor(public payload: JobSearchFilter) {
  }
}

/**
 * Action to Apply the Query Panel Values
 */
export class ApplyQueryValuesAction implements Action {
  readonly type = APPLY_QUERY_VALUES;

  constructor(public payload: JobQueryPanelValues, public init = false) {
  }
}

/**
 * Action to apply the Filter Panel Value
 */
export class ApplyFilterValuesAction implements Action {
  readonly type = APPLY_FILTER_VALUES;

  constructor(public payload: FilterPanelValues) {
  }
}

/**
 * Action in order to apply a new Filter
 */
export class ApplyFilterAction implements Action {
  readonly type = APPLY_FILTER;

  constructor(public payload: JobSearchFilter) {
  }
}

/**
 * Action after the Filter has been applied
 */
export class FilterAppliedAction implements Action {
  readonly type = FILTER_APPLIED;

  constructor(public payload: { page: Array<JobAdvertisementWithFavourites>, totalCount: number }) {
  }
}

export class LoadNextPageAction implements Action {
  readonly type = LOAD_NEXT_PAGE;

  constructor(public payload = {}) {
  }
}

export class NextPageLoadedAction implements Action {
  readonly type = NEXT_PAGE_LOADED;

  constructor(public payload: { page: Array<JobAdvertisementWithFavourites> }) {
  }
}

export class NextPageNotAvailableAction implements Action {
  readonly type = NEXT_PAGE_NOT_AVAILABLE;

  constructor(public payload = {}) {
  }
}

export class JobAdvertisementDetailLoadedAction implements Action {
  readonly type = JOB_ADVERTISEMENT_DETAIL_LOADED;

  constructor(public payload: { jobAdvertisement: JobAdvertisement }) {
  }
}

export class JobAdvertisementDetailUnloadedAction implements Action {
  readonly type = JOB_ADVERTISEMENT_DETAIL_UNLOADED;

  constructor(public payload: {}) {
  }
}

export class LoadPreviousJobAdvertisementDetailAction implements Action {
  readonly type = LOAD_PREVIOUS_JOB_ADVERTISEMENT_DETAIL;

  constructor(public payload = {}) {
  }
}

export class LoadNextJobAdvertisementDetailAction implements Action {
  readonly type = LOAD_NEXT_JOB_ADVERTISEMENT_DETAIL;

  constructor(public payload = {}) {
  }
}

/**
 * Action that is fired if the language changed and the selected occupations have been translated again
 */
export class OccupationLanguageChangedAction implements Action {
  readonly type = OCCUPATION_LANGUAGE_CHANGED_ACTION;

  constructor(public payload: { occupations: OccupationTypeaheadItem[] }) {
  }
}

export class ResetAction implements Action {
  readonly type = RESET;

  constructor(public payload = {}) {
  }
}

export class FavouriteItemLoadedAction implements Action {
  readonly type = FAVOURITE_ITEM_LOADED;

  constructor(public payload: { favouriteItem: FavouriteItem }) {
  }
}

export class SearchProfileUpdatedAction implements Action {
  readonly type = SEARCH_PROFILE_UPDATED;

  constructor(public payload: { searchProfile: ResolvedJobAdSearchProfile }) {
  }
}

export class JobAlertToggledAction implements Action {
  readonly type = JOB_ALERT_TOGGLED;

  constructor(public payload: { searchProfile: ResolvedJobAdSearchProfile }) {
  }
}

export type Actions =
  | InitializeResultListAction
  | ResultListAlreadyInitializedAction
  | FilterAppliedAction
  | ApplyFilterAction
  | LoadNextPageAction
  | NextPageLoadedAction
  | NextPageNotAvailableAction
  | JobAdvertisementDetailLoadedAction
  | JobAdvertisementDetailUnloadedAction
  | LoadPreviousJobAdvertisementDetailAction
  | LoadNextJobAdvertisementDetailAction
  | ResetFilterAction
  | ApplyFilterValuesAction
  | ApplyQueryValuesAction
  | AddJobAdFavouriteAction
  | AddedJobAdFavouriteAction
  | RemoveJobAdFavouriteAction
  | RemovedJobAdFavouriteAction
  | OccupationLanguageChangedAction
  | UpdatedJobAdFavouriteAction
  | ResetAction
  | FavouriteItemLoadedAction
  | EffectErrorOccurredAction
  | SearchProfileUpdatedAction
  | JobAlertToggledAction;
