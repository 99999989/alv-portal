import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { asyncScheduler, Observable, of } from 'rxjs/index';
import { Action, select, Store } from '@ngrx/store';
import {
  APPLY_FILTER,
  APPLY_FILTER_VALUES,
  APPLY_QUERY_VALUES,
  ApplyFilterAction,
  FilterAppliedAction,
  FilterResetAction,
  INITIALIZE_RESULT_LIST,
  LOAD_NEXT_JOB_ADVERTISEMENT_DETAIL,
  LOAD_NEXT_PAGE,
  LOAD_PREVIOUS_JOB_ADVERTISEMENT_DETAIL,
  LoadNextPageAction,
  NEXT_PAGE_LOADED,
  NextPageLoadedAction,
  NextPageNotAvailableAction,
  OccupationLanguageChangedAction,
  RESET_FILTER,
  ResetAction,
  ResultListAlreadyInitializedAction,
} from '../actions';
import { JobAdvertisementRepository } from '../../../../shared/backend-services/job-advertisement/job-advertisement.repository';
import {
  catchError,
  concatMap,
  debounceTime,
  filter,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import {
  getJobAdSearchState,
  getJobSearchFilter,
  getNextId,
  getPrevId,
  hasNextPage,
  JobAdSearchState,
  JobSearchFilter
} from '../state';
import { JobSearchRequestMapper } from './job-search-request.mapper';
import { Router } from '@angular/router';
import { JobAdvertisementSearchResponse } from '../../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { SchedulerLike } from 'rxjs';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';
import {
  EffectErrorOccurredAction,
  LANGUAGE_CHANGED,
  LanguageChangedAction,
  LAZY_LOADED_MODULE_DESTROYED,
  LazyLoadedModuleDestroyedAction,
  ModuleName
} from '../../../../core/state-management/actions/core.actions';
import { OccupationSuggestionService } from '../../../../shared/occupations/occupation-suggestion.service';
import { JobAdFavouritesRepository } from '../../../../shared/backend-services/favourites/job-ad-favourites.repository';
import { AuthenticationService } from '../../../../core/auth/authentication.service';

export const JOB_AD_SEARCH_EFFECTS_DEBOUNCE = new InjectionToken<number>('JOB_AD_SEARCH_EFFECTS_DEBOUNCE');
export const JOB_AD_SEARCH_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>('JOB_AD_SEARCH_EFFECTS_SCHEDULER');

@Injectable()
export class JobAdSearchEffects {

  @Effect()
  reset$ = this.actions$.pipe(
    ofType(LAZY_LOADED_MODULE_DESTROYED),
    map((action: LazyLoadedModuleDestroyedAction) => action.payload),
    filter(action => action.moduleName === ModuleName.JOB_SEARCH),
    map(() => {
      return new ResetAction();
    })
  );

  @Effect()
  initJobSearch$ = this.actions$.pipe(
    ofType(INITIALIZE_RESULT_LIST),
    withLatestFrom(this.store.pipe<JobAdSearchState>(select(getJobAdSearchState))),
    filter(([action, state]) => state.isDirtyResultList),
    switchMap(([action, state]: [Action, JobAdSearchState]) => {
      const request = JobSearchRequestMapper.mapToRequest(state.jobSearchFilter, state.page);
      return this.jobAdvertisementRepository.search(request).pipe(
        map((response) => new FilterAppliedAction({
          page: response.result,
          totalCount: response.totalCount
        })),
        catchError((errorResponse) => of(new EffectErrorOccurredAction({ httpError: errorResponse })))
      );
    })
  );

  @Effect()
  resultListAlreadyInitialized$ = this.actions$.pipe(
    ofType(INITIALIZE_RESULT_LIST),
    withLatestFrom(this.store.pipe<JobAdSearchState>(select(getJobAdSearchState))),
    filter(([action, state]) => !state.isDirtyResultList),
    map(() => {
      return new ResultListAlreadyInitializedAction();
    })
  );

  @Effect()
  applyFilter$: Observable<Action> = this.actions$.pipe(
    ofType(APPLY_FILTER),
    debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
    withLatestFrom(this.store.pipe<JobAdSearchState>(select(getJobAdSearchState))),
    switchMap(([action, state]: [ApplyFilterAction, JobAdSearchState]) => {
      const request = JobSearchRequestMapper.mapToRequest(action.payload, state.page);
      return this.jobAdvertisementRepository.search(request).pipe(
        map((response) => new FilterAppliedAction({
          page: response.result,
          totalCount: response.totalCount
        })),
        catchError((errorResponse) => of(new EffectErrorOccurredAction({ httpError: errorResponse })))
      );
    })
  );

  @Effect()
  resetFilter$: Observable<Action> = this.actions$.pipe(
    ofType(RESET_FILTER),
    withLatestFrom(this.store.pipe<JobSearchFilter>(select(getJobSearchFilter))),
    switchMap(([action, jobSearchFilter]) => {
      return [
        new ApplyFilterAction(jobSearchFilter),
        new FilterResetAction(jobSearchFilter)
      ];
    })
  );

  @Effect()
  applyQueryValues$: Observable<Action> = this.actions$.pipe(
    ofType(APPLY_QUERY_VALUES),
    withLatestFrom(this.store.pipe<JobAdSearchState>(select(getJobAdSearchState))),
    map(([action, state]) => new ApplyFilterAction(state.jobSearchFilter))
  );

  @Effect()
  applyFilterValues$: Observable<Action> = this.actions$.pipe(
    ofType(APPLY_FILTER_VALUES),
    withLatestFrom(this.store.pipe<JobAdSearchState>(select(getJobAdSearchState))),
    map(([action, state]) => new ApplyFilterAction(state.jobSearchFilter))
  );

  @Effect()
  loadNextPage$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_NEXT_PAGE),
    withLatestFrom(this.store.pipe(select(hasNextPage))),
    filter(([action, nextPageAvailable]) => nextPageAvailable),
    debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
    withLatestFrom(this.store.pipe<JobAdSearchState>(select(getJobAdSearchState))),
    concatMap(([action, state]) => {
      const request = JobSearchRequestMapper.mapToRequest(state.jobSearchFilter, state.page + 1);
      return this.jobAdvertisementRepository.search(request).pipe(
        map((response: JobAdvertisementSearchResponse) => new NextPageLoadedAction({ page: response.result })),
        catchError((errorResponse) => of(new EffectErrorOccurredAction({ httpError: errorResponse })))
      );
    }),
  );

  @Effect()
  loadNoMoreNextPage$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_NEXT_PAGE),
    withLatestFrom(this.store.pipe(select(hasNextPage))),
    filter(([action, nextPageAvailable]) => !nextPageAvailable),
    map(() => {
      return new NextPageNotAvailableAction({});
    })
  );

  @Effect()
  loadPreviousJobAdvertisementDetail$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_PREVIOUS_JOB_ADVERTISEMENT_DETAIL),
    withLatestFrom(this.store.pipe(select(getPrevId))),
    map(([action, id]) => id),
    tap((id) => {
      this.router.navigate(['/job-search', id]);
    }),
    map(() => {
      return { type: 'nothing' };
    })
  );

  @Effect()
  translateOccupationsOnLanguageChanged$: Observable<Action> = this.actions$.pipe(
    ofType(LANGUAGE_CHANGED),
    map((a: LanguageChangedAction) => a),
    withLatestFrom(this.store.pipe<JobSearchFilter>(select(getJobSearchFilter))),
    filter(([action, jobSearchFilter]) => !!jobSearchFilter.occupations),
    filter(([action, jobSearchFilter]) => jobSearchFilter.occupations.length > 0),
    switchMap(([action, jobSearchFilter]) => {
      return this.occupationSuggestionService.translateAll(jobSearchFilter.occupations, action.payload.language);
    }),
    map((updatedOccupations) => {
      return new OccupationLanguageChangedAction({ occupations: updatedOccupations });
    })
  );

  @Effect()
  loadNextJobAdvertisementDetail$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_NEXT_JOB_ADVERTISEMENT_DETAIL),
    withLatestFrom(this.store.pipe(select(getNextId))),
    switchMap(([action, id]) => {
      if (id) {
        return of(id);
      } else {
        this.store.dispatch(new LoadNextPageAction());
        return this.actions$.pipe(
          ofType(NEXT_PAGE_LOADED),
          take(1),
          map((nextPageLoadedAction: NextPageLoadedAction) => {
            return nextPageLoadedAction.payload.page[0].jobAdvertisement.id;
          })
        );
      }
    }),
    tap((id) => {
      this.router.navigate(['/job-search', id]);
    }),
    map(() => {
      return { type: 'nothing' };
    })
  );

  constructor(private actions$: Actions,
              private occupationSuggestionService: OccupationSuggestionService,
              private jobAdvertisementRepository: JobAdvertisementRepository,
              private jobAdFavouritesRepository: JobAdFavouritesRepository,
              private store: Store<JobAdSearchState>,
              private authenticationService: AuthenticationService,
              private router: Router,
              @Optional()
              @Inject(JOB_AD_SEARCH_EFFECTS_DEBOUNCE)
              private debounce,
              @Optional()
              @Inject(JOB_AD_SEARCH_EFFECTS_SCHEDULER)
              private scheduler: AsyncScheduler) {

  }

}
