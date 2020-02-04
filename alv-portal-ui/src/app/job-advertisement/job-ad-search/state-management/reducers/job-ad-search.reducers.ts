import {
  initialState,
  JobAdSearchState
} from '../state';
import {
  Actions,
  APPLY_FILTER,
  APPLY_FILTER_VALUES,
  APPLY_QUERY_VALUES,
  FAVOURITE_ITEM_LOADED,
  FILTER_APPLIED,
  INITIALIZE_RESULT_LIST,
  JOB_ADVERTISEMENT_DETAIL_LOADED,
  JOB_ADVERTISEMENT_DETAIL_UNLOADED,
  JOB_ALERT_TOGGLED,
  LOAD_NEXT_PAGE,
  NEXT_PAGE_LOADED,
  NEXT_PAGE_NOT_AVAILABLE,
  OCCUPATION_LANGUAGE_CHANGED_ACTION,
  RESET,
  RESET_FILTER,
  RESULT_LIST_ALREADY_INITIALIZED,
  SEARCH_PROFILE_UPDATED
} from '../actions';
import {
  ADDED_JOB_AD_FAVOURITE,
  EFFECT_ERROR_OCCURRED,
  REMOVED_JOB_AD_FAVOURITE,
  UPDATED_JOB_AD_FAVOURITE
} from '../../../../core/state-management/actions/core.actions';
import { FavouriteItem } from '../../../../shared/backend-services/job-advertisement/job-advertisement.types';

function patchFavouriteItem(state: JobAdSearchState, jobAdId: string, patchedFavouriteItem: FavouriteItem) {
  const indexToUpdate = state.resultList.findIndex(item => item.jobAdvertisement.id === jobAdId);
  if (indexToUpdate >= 0) {
    const updatedResultList = [...state.resultList];
    updatedResultList[indexToUpdate].favouriteItem = patchedFavouriteItem;
    return updatedResultList;
  } else {
    return state.resultList;
  }
}

export function jobAdSearchReducer(state = initialState, action: Actions): JobAdSearchState {

  let newState: JobAdSearchState;

  switch (action.type) {

    case INITIALIZE_RESULT_LIST:
      newState = {
        ...state,
        resultsAreLoading: true
      };
      break;

    case NEXT_PAGE_NOT_AVAILABLE:
    case RESULT_LIST_ALREADY_INITIALIZED:
      newState = {
        ...state,
        resultsAreLoading: false
      };
      break;

    case RESET:
      newState = {
        ...initialState
      };
      break;

    case APPLY_QUERY_VALUES:
      newState = {
        ...state,
        jobSearchFilter: {
          ...(action.init ? initialState.jobSearchFilter : state.jobSearchFilter),
          ...action.payload
        }
      };
      break;

    case APPLY_FILTER_VALUES:
      newState = {
        ...state,
        jobSearchFilter: {
          ...state.jobSearchFilter,
          ...action.payload
        }
      };
      break;

    case APPLY_FILTER:
      newState = {
        ...state,
        jobSearchFilter: {
          ...action.payload
        },
        page: 0,
        resultsAreLoading: true,
      };
      break;

    case FILTER_APPLIED:
      newState = {
        ...state,
        resultList: [...action.payload.page],
        totalCount: action.payload.totalCount,
        resultsAreLoading: false,
        isDirtyResultList: false
      };
      break;

    case OCCUPATION_LANGUAGE_CHANGED_ACTION:
      newState = {
        ...state,
        jobSearchFilter: {
          ...state.jobSearchFilter,
          occupations: action.payload.occupations,
        }
      };
      break;

    case RESET_FILTER:
      newState = {
        ...state,
        jobSearchFilter: {
          ...initialState.jobSearchFilter
        },
        jobAdSearchProfile: initialState.jobAdSearchProfile
      };
      break;

    case LOAD_NEXT_PAGE:
      newState = {
        ...state,
        resultsAreLoading: true
      };
      break;

    case NEXT_PAGE_LOADED:
      newState = {
        ...state,
        resultList: [...state.resultList, ...action.payload.page],
        page: state.page + 1,
        resultsAreLoading: false
      };
      break;

    case JOB_ADVERTISEMENT_DETAIL_UNLOADED: {
      newState = {
        ...state,
        details: {
          ...initialState.details,
        }
      };
      break;
    }

    case JOB_ADVERTISEMENT_DETAIL_LOADED:
      const currentVisited = state.visitedJobAds;
      currentVisited[action.payload.jobAdvertisement.id] = true;
      newState = {
        ...state,
        visitedJobAds: { ...currentVisited },
        lastVisitedJobAdId: action.payload.jobAdvertisement.id,
        details: {
          ...state.details,
          jobAdvertisement: action.payload.jobAdvertisement
        }
      };
      break;

    case ADDED_JOB_AD_FAVOURITE:
    case UPDATED_JOB_AD_FAVOURITE: {
      newState = {
        ...state,
        resultList: patchFavouriteItem(state, action.payload.favouriteItem.jobAdvertisementId, action.payload.favouriteItem),
        details: {
          ...state.details,
          favouriteItem: action.payload.favouriteItem
        }
      };
      break;
    }

    case REMOVED_JOB_AD_FAVOURITE: {
      newState = {
        ...state,
        resultList: patchFavouriteItem(state, action.payload.removedFavouriteItem.jobAdvertisementId, null),
        details: {
          ...state.details,
          favouriteItem: null
        }
      };
      break;
    }

    case FAVOURITE_ITEM_LOADED: {
      newState = {
        ...state,
        details: {
          ...state.details,
          favouriteItem: action.payload.favouriteItem
        }
      };
      break;
    }

    case SEARCH_PROFILE_UPDATED: {
      newState = {
        ...state,
        jobAdSearchProfile: action.payload.searchProfile
      };
      break;
    }

    case JOB_ALERT_TOGGLED: {
      newState = {
        ...state,
        jobAdSearchProfile: action.payload.searchProfile
      };
      break;
    }

    case EFFECT_ERROR_OCCURRED: {
      newState = {
        ...state,
        resultsAreLoading: false
      };
      break;
    }

    default:
      newState = state;
  }

  return newState;
}
