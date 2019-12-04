import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { asyncScheduler, Observable } from 'rxjs';
import {
  ApplyFilterAction,
  CANDIDATE_PROFILE_DETAIL_LOADED,
  CandidateClickedAction,
  CandidateProfileDetailLoadedAction,
  CONTACT_CANDIDATE_DIALOG_OPENED,
  CONTACT_CANDIDATE_DIALOG_SUBMITTED,
  ContactCandidateDialogOpenedAction,
  ContactCandidateDialogSubmittedAction,
  COPY_LINK,
  CopyLinkAction,
  EXPAND_CONTACT_INFO,
  ExpandContactInfoAction,
  FILTER_APPLIED,
  FilterAppliedAction,
  LOAD_NEXT_CANDIDATE_PROFILE_DETAIL,
  LOAD_PREVIOUS_CANDIDATE_PROFILE_DETAIL,
  LoadNextCandidateProfileDetailAction,
  LoadPreviousCandidateProfileDetailAction,
  NEXT_PAGE_LOADED,
  NextPageLoadedAction,
  PRINT_PAGE,
  PrintPageAction,
  SELECT_CANDIDATE,
  SELECT_CANDIDATE_PHONE,
  SELECT_RAV_EMAIL,
  SELECT_RAV_PHONE,
  SelectCandidatePhoneAction,
  SelectRavEmailAction,
  SelectRavPhoneAction,
  SEND_LINK,
  SendLinkAction
} from '../actions';
import { debounceTime, switchMap, withLatestFrom } from 'rxjs/operators';
import { KofTrackingService } from '../../../../shared/tracking/kof-tracking.service';
import {
  CandidateDetailsEventType,
  CandidateSearchEventType,
  TrackingEvent
} from '../../../../shared/tracking/tracking.types';
import { Action, select, Store } from '@ngrx/store';
import {
  CandidateSearchResult,
  CandidateSearchState,
  getCandidateSearchFilter,
  getCandidateSearchResults,
  getNextId,
  getPrevId,
  getSelectedCandidateProfile
} from '../state';
import {
  CANDIDATE_SEARCH_EFFECTS_DEBOUNCE,
  CANDIDATE_SEARCH_EFFECTS_SCHEDULER
} from './index';
import { CandidateProfile } from '../../../../shared/backend-services/candidate/candidate.types';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';

function pluckIds(items: CandidateProfile[]) {
  return items.map(item => item.externalId);
}

function findItemById(searchResults, id) {
  return searchResults.findIndex((s: CandidateSearchResult) => s.candidateProfile.id === id);
}

const CDEvent = CandidateDetailsEventType;

@Injectable()
export class CandidateSearchLoggingEffects {
  @Effect({ dispatch: false })
  logCandidateClicked: Observable<Object> = this.actions$.pipe(
    ofType<CandidateClickedAction>(SELECT_CANDIDATE),
    withLatestFrom(this.store.pipe(select(getCandidateSearchResults))),
    switchMap(([action, searchResults]) => {
      const actionPayload = {
        id: action.payload.candidateProfile.externalId,
        index: findItemById(searchResults, action.payload.candidateProfile.id)
      };
      const evt = new TrackingEvent(CandidateSearchEventType.SELECT_CANDIDATE, actionPayload);
      return this.trackingService.logEvent(evt);
    })
  );

  @Effect({ dispatch: false })
  logSearchSubmitted$: Observable<Object> = this.actions$.pipe(
    ofType<ApplyFilterAction>(FILTER_APPLIED),
    withLatestFrom(this.store.pipe(select(getCandidateSearchFilter))),
    switchMap(([action, filter]) => this.trackingService.logEvent(new TrackingEvent(CandidateSearchEventType.SEARCH_SUBMITTED, filter)))
  );

  @Effect({ dispatch: false })
  logSearchResultsLoaded$: Observable<Object> = this.actions$.pipe(
    ofType<FilterAppliedAction | NextPageLoadedAction>(FILTER_APPLIED, NEXT_PAGE_LOADED),
    switchMap((action: FilterAppliedAction | NextPageLoadedAction) => this.trackingService.logEvent(new TrackingEvent(CandidateSearchEventType.SEARCH_RESULTS_LOADED, {
      ...action.payload,
      page: pluckIds(action.payload.page),
      pageNumber: action.payload['pageNumber'] || 0
    }))),
  );

  @Effect({ dispatch: false })
  logLoadNextCandidateProfile$ = this.logNextPrevAction<LoadNextCandidateProfileDetailAction>(LOAD_NEXT_CANDIDATE_PROFILE_DETAIL, CDEvent.NEXT_CANDIDATE_CLICKED, getNextId);

  @Effect({ dispatch: false })
  logLoadPreviousCandidateProfile$ = this.logNextPrevAction<LoadPreviousCandidateProfileDetailAction>(LOAD_PREVIOUS_CANDIDATE_PROFILE_DETAIL, CDEvent.PREVIOUS_CANDIDATE_CLICKED, getPrevId);

  @Effect({ dispatch: false })
  logPrintCandidatePage$ = this.logIdByAction<PrintPageAction>(PRINT_PAGE, CDEvent.PRINT_PAGE_CLICKED);

  @Effect({ dispatch: false })
  logEmailShare$ = this.logIdByAction<SendLinkAction>(SEND_LINK, CDEvent.EMAIL_LINK_CLICKED);

  @Effect({ dispatch: false })
  logPhoneRav$ = this.logIdByAction<SelectRavPhoneAction>(SELECT_RAV_PHONE, CDEvent.RAV_PHONE_CLICKED);

  @Effect({ dispatch: false })
  logEmailRav$ = this.logIdByAction<SelectRavEmailAction>(SELECT_RAV_EMAIL, CDEvent.RAV_EMAIL_CLICKED);

  @Effect({ dispatch: false })
  logContactCandidateDialogOpened$ = this.logIdByAction<ContactCandidateDialogOpenedAction>(CONTACT_CANDIDATE_DIALOG_OPENED, CDEvent.CONTACT_CANDIDATE_DIALOG_OPENED);

  @Effect({ dispatch: false })
  logContactCandidateDialogSubmitted$ = this.logIdByAction<ContactCandidateDialogSubmittedAction>(CONTACT_CANDIDATE_DIALOG_SUBMITTED, CDEvent.CONTACT_CANDIDATE_DIALOG_SUBMITTED);

  @Effect({ dispatch: false })
  logCandidatePhoneSelected$ = this.logIdByAction<SelectCandidatePhoneAction>(SELECT_CANDIDATE_PHONE, CDEvent.CANDIDATE_PHONE_CLICKED);

  @Effect({ dispatch: false })
  logCandidateCopy$ = this.logIdByAction<CopyLinkAction>(COPY_LINK, CDEvent.COPY_LINK_CLICKED);

  @Effect({ dispatch: false })
  logExpandContactInfo$ = this.logIdByAction<ExpandContactInfoAction>(EXPAND_CONTACT_INFO, CDEvent.CANDIDATE_CONTACT_INFO_EXPANDED);

  @Effect({ dispatch: false })
  logCandidateDetailsLoaded$: Observable<Object> = this.actions$.pipe(
    ofType<CandidateProfileDetailLoadedAction>(CANDIDATE_PROFILE_DETAIL_LOADED),
    switchMap((action: CandidateProfileDetailLoadedAction) => {
      const eventData = { id: action.payload.candidateProfile.externalId };
      const evt = new TrackingEvent(CDEvent.CANDIDATE_PROFILE_LOADED, eventData);
      return this.trackingService.logEvent(evt);
    })
  );


  constructor(private actions$: Actions,
              private trackingService: KofTrackingService,
              private store: Store<CandidateSearchState>,
              @Optional() @Inject(CANDIDATE_SEARCH_EFFECTS_DEBOUNCE) private debounce,
              @Optional() @Inject(CANDIDATE_SEARCH_EFFECTS_SCHEDULER) private scheduler: AsyncScheduler) {
  }

  /**
   * generates simple Effect that logs candidate id when action of actionType happens
   */
  private logIdByAction<T extends Action>(actionType: string, loggingEventType: CandidateDetailsEventType): Observable<Object> {
    return this.actions$.pipe(
      ofType<T>(actionType),
      withLatestFrom(this.store.pipe(select(getSelectedCandidateProfile))),
      switchMap(([action, profile]) => {
        return this.trackingService.logEvent(new TrackingEvent(loggingEventType, { id: (<CandidateProfile>profile).externalId }));
      })
    );
  }

  private logNextPrevAction<T extends Action>(actionType: string, trackingEventType, selector): Observable<Object> {
    return this.actions$.pipe(
      ofType<T>(actionType),
      withLatestFrom(this.store.pipe(select(selector)), this.store.pipe(select(getCandidateSearchResults))),
      debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
      switchMap(([a, id, searchResults]) => {
        const index = findItemById(searchResults, id);
        const searchResultItem = searchResults[index];
        const externalId = searchResultItem
          ? searchResultItem.candidateProfile.externalId
          : 'UNKNOWN';

        return this.trackingService.logEvent(new TrackingEvent(trackingEventType, {
          id: externalId,
          index: index
        }));
      })
    );
  }
}

