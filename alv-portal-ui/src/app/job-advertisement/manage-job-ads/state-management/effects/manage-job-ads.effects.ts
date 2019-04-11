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
import { asyncScheduler, Observable, of } from 'rxjs';
import {
  EffectErrorOccurredAction,
  LAZY_LOADED_MODULE_DESTROYED,
  LazyLoadedModuleDestroyedAction,
  ModuleName
} from '../../../../core/state-management/actions/core.actions';
import {
  getManageJobAdsState,
  getNextId,
  getPrevId,
  hasNextPage,
  ManageJobAdsState
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
import { getCurrentCompanyContactTemplateModel } from '../../../../core/state-management/state/core.state.ts';
import { ManagedJobAdsSearchResponse } from '../../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { SchedulerLike } from 'rxjs/src/internal/types';
import { ManagedJobAdsSearchRequestMapper } from '../../../../widgets/manage-job-ads-widget/managed-job-ads-search-request.mapper';
import { Router } from '@angular/router';
import { CompanyContactTemplateModel } from '../../../../core/auth/company-contact-template-model';


export const MANAGE_JOB_ADS_EFFECTS_DEBOUNCE = new InjectionToken<number>('MANAGE_JOB_ADS_EFFECTS_DEBOUNCE');
export const MANAGE_JOB_ADS_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>('MANAGE_JOB_ADS_EFFECTS_SCHEDULER');

@Injectable()
export class ManageJobAdsEffects {

  @Effect()
  reset$ = this.actions$.pipe(
    ofType(LAZY_LOADED_MODULE_DESTROYED),
    map((action: LazyLoadedModuleDestroyedAction) => action.payload),
    filter(action => action.moduleName === ModuleName.MANAGE_JOB_AD),
    map(() => {
      return new ResetAction();
    })
  );

  @Effect()
  initResultList$ = this.actions$.pipe(
    ofType(INITIALIZE_RESULT_LIST),
    withLatestFrom(this.store.pipe<ManageJobAdsState>(select(getManageJobAdsState)), this.store.pipe<CompanyContactTemplateModel>(select(getCurrentCompanyContactTemplateModel))),
    filter(([action, state, company]) => state.isDirtyResultList),
    switchMap(([action, state, company]) => {
      return this.jobAdvertisementRepository.searchManagedJobAds(ManagedJobAdsSearchRequestMapper.mapToRequest(state.filter, state.page, company.companyExternalId)).pipe(
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
    withLatestFrom(this.store.pipe<ManageJobAdsState>(select(getManageJobAdsState))),
    filter(([action, state]) => !state.isDirtyResultList),
    map(() => {
      return new ResultListAlreadyInitializedAction();
    })
  );

  @Effect()
  applyFilter$: Observable<Action> = this.actions$.pipe(
    ofType(APPLY_FILTER),
    map((action: ApplyFilterAction) => action.payload),
    debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
    withLatestFrom(this.store.pipe<ManageJobAdsState>(select(getManageJobAdsState)), this.store.pipe<CompanyContactTemplateModel>(select(getCurrentCompanyContactTemplateModel))),
    switchMap(([managedJobAdsSearchFilter, state, company]) => {
      return this.jobAdvertisementRepository.searchManagedJobAds(ManagedJobAdsSearchRequestMapper.mapToRequest(managedJobAdsSearchFilter, state.page, company.companyExternalId)).pipe(
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
    withLatestFrom(this.store.pipe<ManageJobAdsState>(select(getManageJobAdsState)), this.store.pipe<CompanyContactTemplateModel>(select(getCurrentCompanyContactTemplateModel))),
    concatMap(([action, state, company]) => {
      const request = ManagedJobAdsSearchRequestMapper.mapToRequest(state.filter, state.page + 1, company.companyExternalId);
      return this.jobAdvertisementRepository.searchManagedJobAds(request).pipe(
        map((response: ManagedJobAdsSearchResponse) => new NextPageLoadedAction({ page: response.result })),
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
      this.router.navigate(['/manage-job-ads', id]);
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
            return nextPageLoadedAction.payload.page[0].id;
          })
        );
      }
    }),
    tap((id) => {
      this.router.navigate(['/manage-job-ads', id]);
    }),
    map(() => {
      return { type: 'nothing' };
    })
  );

  constructor(private actions$: Actions,
              private store: Store<ManageJobAdsState>,
              private jobAdvertisementRepository: JobAdvertisementRepository,
              private router: Router,
              @Optional()
              @Inject(MANAGE_JOB_ADS_EFFECTS_DEBOUNCE)
              private debounce,
              @Optional()
              @Inject(MANAGE_JOB_ADS_EFFECTS_SCHEDULER)
              private scheduler: AsyncScheduler) {
  }
}
