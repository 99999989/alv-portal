import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { AsyncScheduler } from 'rxjs/internal/scheduler/AsyncScheduler';
import { SchedulerLike } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
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
import { CandidateRepository } from '../../../../shared/backend-services/candidate/candidate.repository';
import { asyncScheduler, Observable, of } from 'rxjs/index';
import {
  EffectErrorOccurredAction,
  LANGUAGE_CHANGED,
  LanguageChangedAction,
  LAZY_LOADED_MODULE_DESTROYED,
  LazyLoadedModuleDestroyedAction,
  ModuleName
} from '../../../../core/state-management/actions/core.actions';
import {
  APPLY_FILTER,
  APPLY_FILTER_VALUES,
  APPLY_QUERY_VALUES,
  ApplyFilterAction,
  FilterAppliedAction,
  FilterResetAction,
  INITIALIZE_RESULT_LIST,
  LOAD_NEXT_CANDIDATE_PROFILE_DETAIL,
  LOAD_NEXT_PAGE,
  LOAD_PREVIOUS_CANDIDATE_PROFILE_DETAIL,
  LoadNextPageAction,
  NEXT_PAGE_LOADED,
  NextPageLoadedAction,
  OccupationLanguageChangedAction,
  RESET_FILTER,
  ResetAction,
  ResultListInitializedAction
} from '../actions';
import { Router } from '@angular/router';
import { OccupationSuggestionService } from '../../../../shared/occupations/occupation-suggestion.service';
import {
  CandidateSearchState,
  getCandidateSearchFilter,
  getCandidateSearchState,
  getNextId,
  getPrevId
} from '../state';
import { CandidateSearchRequestMapper } from './candidate-search-request.mapper';

export const CANDIDATE_SEARCH_EFFECTS_DEBOUNCE = new InjectionToken<number>('CANDIDATE_SEARCH_EFFECTS_DEBOUNCE');
export const CANDIDATE_SEARCH_EFFECTS_SCHEDULER = new InjectionToken<SchedulerLike>('CANDIDATE_SEARCH_EFFECTS_SCHEDULER');

@Injectable()
export class CandidateSearchEffects {

  @Effect()
  reset$ = this.actions$.pipe(
    ofType(LAZY_LOADED_MODULE_DESTROYED),
    map((action: LazyLoadedModuleDestroyedAction) => action.payload),
    filter(action => action.moduleName === ModuleName.CANDIDATE_SEARCH),
    map(() => {
      return new ResetAction();
    })
  );

  @Effect()
  initCandidateSearch$ = this.actions$.pipe(
    ofType(INITIALIZE_RESULT_LIST),
    withLatestFrom(this.store.pipe(select(getCandidateSearchState))),
    switchMap(([a, state]) => {
        if (state.isDirtyResultList) {
          return this.candidateRepository.searchCandidateProfiles(CandidateSearchRequestMapper.mapToRequest(state.candidateSearchFilter, state.page))
            .pipe(
              map((response) => new FilterAppliedAction({
                page: response.result,
                totalCount: response.totalCount
              })),
              catchError((errorResponse) => of(new EffectErrorOccurredAction({ httpError: errorResponse })))
            );
        } else {
          return of(new ResultListInitializedAction());
        }
      }
    )
  );

  @Effect()
  applyFilter$: Observable<Action> = this.actions$.pipe(
    ofType(APPLY_FILTER),
    map((action: ApplyFilterAction) => action.payload),
    debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
    withLatestFrom(this.store.pipe(select(getCandidateSearchState))),
    switchMap(([candidateSearchFilter, state]) => this.candidateRepository.searchCandidateProfiles(CandidateSearchRequestMapper.mapToRequest(candidateSearchFilter, state.page)).pipe(
      map((response) => new FilterAppliedAction({
        page: response.result,
        totalCount: response.totalCount
      })),
      catchError((errorResponse) => of(new EffectErrorOccurredAction({ httpError: errorResponse })))
    )),
  );

  @Effect()
  applyFilterValues$: Observable<Action> = this.actions$.pipe(
    ofType(APPLY_FILTER_VALUES),
    withLatestFrom(this.store.pipe(select(getCandidateSearchState))),
    map(([action, state]) => new ApplyFilterAction(state.candidateSearchFilter))
  );

  @Effect()
  applyQueryValues$: Observable<Action> = this.actions$.pipe(
    ofType(APPLY_QUERY_VALUES),
    withLatestFrom(this.store.pipe(select(getCandidateSearchState))),
    map(([action, state]) => new ApplyFilterAction(state.candidateSearchFilter))
  );

  @Effect()
  resetFilter$: Observable<Action> = this.actions$.pipe(
    ofType(RESET_FILTER),
    withLatestFrom(this.store.pipe(select(getCandidateSearchFilter))),
    switchMap(([action, candidateSearchFilter]) => {
      return [
        new ApplyFilterAction(candidateSearchFilter),
        new FilterResetAction(candidateSearchFilter)
      ];
    }));

  @Effect()
  translateOccupationsOnLanguageChanged$: Observable<Action> = this.actions$.pipe(
    ofType(LANGUAGE_CHANGED),
    map((a: LanguageChangedAction) => a),
    withLatestFrom(this.store.pipe(select(getCandidateSearchFilter))),
    filter(([action, candidateSearchFilter]) => !!candidateSearchFilter.occupations),
    filter(([action, candidateSearchFilter]) => candidateSearchFilter.occupations.length > 0),
    switchMap(([action, candidateSearchFilter]) => {
      return this.occupationSuggestionService.translateAll(candidateSearchFilter.occupations, action.payload.language);
    }),
    map((updatedOccupations) => {
      return new OccupationLanguageChangedAction({ occupations: updatedOccupations });
    })
  );

  @Effect()
  loadNextPage$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_NEXT_PAGE),
    debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
    withLatestFrom(this.store.pipe(select(getCandidateSearchState))),
    concatMap(([action, state]) => this.candidateRepository.searchCandidateProfiles(CandidateSearchRequestMapper.mapToRequest(state.candidateSearchFilter, state.page + 1))
      .pipe(
        map((response) => new NextPageLoadedAction({pageNumber: state.page + 1, page: response.result })),
        catchError((errorResponse) => of(new EffectErrorOccurredAction({ httpError: errorResponse })))
      ))
  );

  @Effect()
  loadPreviousCandidateProfileDetail$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_PREVIOUS_CANDIDATE_PROFILE_DETAIL),
    withLatestFrom(this.store.pipe(select(getPrevId))),
    map(([action, id]) => id),
    tap((id) => {
      this.router.navigate(['/candidate-search', id]);
    }),
    map(() => {
      return { type: 'nothing' };
    })
  );

  @Effect()
  loadNextCandidateProfileDetail$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_NEXT_CANDIDATE_PROFILE_DETAIL),
    debounceTime(this.debounce || 300, this.scheduler || asyncScheduler),
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
      this.router.navigate(['/candidate-search', id]);
    }),
    map(() => {
      return { type: 'nothing' };
    })
  );

  constructor(
    private occupationSuggestionService: OccupationSuggestionService,
    private actions$: Actions,
    private store: Store<CandidateSearchState>,
    private candidateRepository: CandidateRepository,
    private router: Router,
    @Optional() @Inject(CANDIDATE_SEARCH_EFFECTS_DEBOUNCE) private debounce,
    @Optional() @Inject(CANDIDATE_SEARCH_EFFECTS_SCHEDULER) private scheduler: AsyncScheduler
  ) {
  }
}
