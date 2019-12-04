import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { JobAdvertisementRepository } from '../../../../shared/backend-services/job-advertisement/job-advertisement.repository';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';
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
import { Action, select, Store } from '@ngrx/store';
import { asyncScheduler, Observable, of, SchedulerLike } from 'rxjs';
import {
  EffectErrorOccurredAction,
  LAZY_LOADED_MODULE_DESTROYED,
  LazyLoadedModuleDestroyedAction,
  ModuleName
} from '../../../../core/state-management/actions/core.actions';
import {
  getJobAdFavouritesState,
  getNextId,
  getPrevId,
  hasNextPage,
  JobAdFavouritesState
} from '../state';
import {
  APPLY_FILTER,
  ApplyFilterAction,
  FilterAppliedAction,
  INITIALIZE_RESULT_LIST,
  LOAD_NEXT_JOB_ADVERTISEMENT_DETAIL,
  LOAD_NEXT_PAGE,
  LOAD_PREVIOUS_JOB_ADVERTISEMENT_DETAIL,
  LoadNextPageAction,
  NEXT_PAGE_LOADED,
  NextPageLoadedAction,
  NextPageNotAvailableAction,
  ResetAction,
  ResultListAlreadyInitializedAction
} from '../actions';
import { JobAdvertisementSearchResponse } from '../../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { Router } from '@angular/router';
import { JobAdFavouritesRepository } from '../../../../shared/backend-services/favourites/job-ad-favourites.repository';
import { JobAdFavouritesSearchRequestMapper } from '../../job-ad-favourites/job-ad-favourites-search-request.mapper';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { User } from '../../../../core/auth/user.model';

export const JOB_AD_FAVOURITES_EFFECTS_DEBOUNCE = new InjectionToken<number>('JOB_AD_FAVOURITES_EFFECTS_DEBOUNCE');
export const JOB_AD_FAVOURITES_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>('JOB_AD_FAVOURITES_EFFECTS_SCHEDULER');

@Injectable()
export class JobAdFavouritesEffects {

  @Effect()
  reset$ = this.actions$.pipe(
    ofType(LAZY_LOADED_MODULE_DESTROYED),
    map((action: LazyLoadedModuleDestroyedAction) => action.payload),
    filter(action => action.moduleName === ModuleName.JOB_AD_FAVOURITE),
    map(() => {
      return new ResetAction();
    })
  );

  @Effect()
  initResultList$ = this.actions$.pipe(
    ofType(INITIALIZE_RESULT_LIST),
    withLatestFrom(this.store.pipe<JobAdFavouritesState>(select(getJobAdFavouritesState)), this.authenticationService.getCurrentUser()),
    filter(([action, state]) => state.isDirtyResultList),
    switchMap(([action, state, user]: [Action, JobAdFavouritesState, User]) => {
      const request = JobAdFavouritesSearchRequestMapper.mapToRequest(state.filter, state.page);
      return this.jobAdFavouritesRepository.searchFavourites(request, user.id).pipe(
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
    withLatestFrom(this.store.pipe<JobAdFavouritesState>(select(getJobAdFavouritesState))),
    filter(([action, state]) => !state.isDirtyResultList),
    map(() => {
      return new ResultListAlreadyInitializedAction();
    })
  );

  @Effect()
  applyFilter$: Observable<Action> = this.actions$.pipe(
    ofType(APPLY_FILTER),
    debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
    withLatestFrom(this.store.pipe<JobAdFavouritesState>(select(getJobAdFavouritesState)), this.authenticationService.getCurrentUser()),
    switchMap(([action, state, currentUser]: [ApplyFilterAction, JobAdFavouritesState, User]) => {
      const request = JobAdFavouritesSearchRequestMapper.mapToRequest(action.payload, state.page);
      return this.jobAdFavouritesRepository.searchFavourites(request, currentUser.id).pipe(
        map((response) => new FilterAppliedAction({
          page: response.result,
          totalCount: response.totalCount
        })),
        catchError((errorResponse) => of(new EffectErrorOccurredAction({ httpError: errorResponse })))
      );
    })
  );

  @Effect()
  loadNextPage$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_NEXT_PAGE),
    withLatestFrom(this.store.pipe(select(hasNextPage))),
    filter(([action, nextPageAvailable]) => nextPageAvailable),
    debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
    withLatestFrom(this.store.pipe<JobAdFavouritesState>(select(getJobAdFavouritesState)), this.authenticationService.getCurrentUser()),
    concatMap(([action, state, currentUser]) => {
      const request = JobAdFavouritesSearchRequestMapper.mapToRequest(state.filter, state.page + 1);
      return this.jobAdFavouritesRepository.searchFavourites(request, currentUser.id).pipe(
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
      this.router.navigate(['/job-favourites', id]);
    }),
    map(() => {
      return { type: 'nothing' };
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
      this.router.navigate(['/job-favourites', id]);
    }),
    map(() => {
      return { type: 'nothing' };
    })
  );

  constructor(private actions$: Actions,
              private store: Store<JobAdFavouritesState>,
              private jobAdvertisementRepository: JobAdvertisementRepository,
              private jobAdFavouritesRepository: JobAdFavouritesRepository,
              private router: Router,
              @Optional()
              @Inject(JOB_AD_FAVOURITES_EFFECTS_DEBOUNCE)
              private debounce,
              @Optional()
              @Inject(JOB_AD_FAVOURITES_EFFECTS_SCHEDULER)
              private scheduler: AsyncScheduler,
              private authenticationService: AuthenticationService) {
  }
}
