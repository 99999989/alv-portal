import {Store, StoreModule} from '@ngrx/store';
import {
  CANDIDATE_SEARCH_EFFECTS_DEBOUNCE,
  CANDIDATE_SEARCH_EFFECTS_SCHEDULER,
  CandidateSearchEffects
} from './candidate-search.effects';
import {candidateSearchReducer} from '../reducers';
import {
  ApplyFilterAction,
  ApplyFilterValuesAction,
  ApplyQueryValuesAction,
  FilterAppliedAction,
  FilterResetAction,
  InitializeResultListAction,
  LoadNextCandidateProfileDetailAction,
  LoadNextPageAction,
  LoadPreviousCandidateProfileDetailAction,
  NextPageLoadedAction,
  ResetFilterAction
} from '../actions';
import {TestBed} from '@angular/core/testing';
import {Actions} from '@ngrx/effects';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {provideMockActions} from '@ngrx/effects/testing';

import {CandidateRepository} from '../../../../shared/backend-services/candidate/candidate.repository';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {OccupationSuggestionService} from '../../../../shared/occupations/occupation-suggestion.service';
import {CandidateProfile} from '../../../../shared/backend-services/candidate/candidate.types';
import {CandidateSearchState, initialState} from '../state';
import {HttpErrorResponse} from '@angular/common/http';
import {EffectErrorOccurredAction} from '../../../../core/state-management/actions/core.actions';
import {FilterPanelValues} from '../../candidate-search/filter-panel/filter-panel.component';
import {CandidateQueryPanelValues} from '../../../../widgets/candidate-search-widget/candidate-query-panel/candidate-query-panel-values';
import SpyObj = jasmine.SpyObj;

describe('CandidateSearchEffects', () => {
  let sut: CandidateSearchEffects;

  let actions$: Observable<any>;
  let store: Store<CandidateSearchState>;
  let candidateRepository: SpyObj<CandidateRepository>;
  let occupationSuggestionService: SpyObj<OccupationSuggestionService>;
  let router: Router;

  beforeEach(() => {
    candidateRepository = jasmine.createSpyObj('mockCandidateRepository', ['searchCandidateProfiles', 'findCandidateProfileById']);
    router = jasmine.createSpyObj('mockRouter', ['navigate']);
    occupationSuggestionService = jasmine.createSpyObj('mockOccupationSuggestionService', ['translateAll']);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ 'candidateSearch': candidateSearchReducer })
      ],
      providers: [
        CandidateSearchEffects,
        provideMockActions(() => actions$),
        { provide: CandidateRepository, useValue: candidateRepository },
        { provide: OccupationSuggestionService, useValue: occupationSuggestionService },
        { provide: Router, useValue: router },
        { provide: CANDIDATE_SEARCH_EFFECTS_DEBOUNCE, useValue: 30 },
        { provide: CANDIDATE_SEARCH_EFFECTS_SCHEDULER, useFactory: getTestScheduler },
      ]
    });

    sut = TestBed.get(CandidateSearchEffects);
    actions$ = TestBed.get(Actions);
    store = TestBed.get(Store);
  });

  describe('initCandidateSearch$', () => {

    const initResultListAction = new InitializeResultListAction();

    const candidateProfile: any = { id: 1 };
    const result = [ candidateProfile as CandidateProfile];

    const candidateSearchResult = { result, totalCount: 10 };
    const filterAppliedAction = new FilterAppliedAction( { page: result, totalCount: 10 });

    /*
     * action: triggered 'a' after 10 F and 30 F delay
     * response: result 'b' returned after 10 F delay
     * expected: 'c' is emitted after 10 F + 10 F = 20 F delay for 1st 'a', and 30 F + 10 F = 40 F delay for 2nd 'a'
     */
    it('should return a new FilterAppliedAction on success', () => {

      // action
      actions$ = hot('-a-a--',   { a: initResultListAction });
      // response
      candidateRepository.searchCandidateProfiles.and.returnValue(cold('-b', { b: candidateSearchResult }));
      // expected
      const expected = cold('--c-c', { c: filterAppliedAction });

      expect(sut.initCandidateSearch$).toBeObservable(expected);
    });

    /*
     * action:  triggered 'a' filterAppliedAction after 10 F delay and after it several times 'b' initResultListAction
     * response: returned empty response and end subscription
     * expected: to emit end subscription after 10 F delay
     */
    // TODO FIX TEST SINCE WE DO NOT UNSUBSCRIBE ANYMORE
    xit('should unsubscribe after FilterAppliedAction is triggered', () => {

      // action
      actions$ = hot('-a-b-b--b-', { a: filterAppliedAction, b: initResultListAction });
      // response
      candidateRepository.searchCandidateProfiles.and.returnValue(cold('|'));
      // expected
      const expected = cold('-|');

      expect(sut.initCandidateSearch$).toBeObservable(expected);
    });

    /*
     * action : triggered two times 'a' initResultListAction after 10 F and 30 F delay, and 'b' filterAppliedAction after 50 F delay
     * response : error response after 10 F delay for 1st 'a', value after 10 F delay for 2nd 'a', and end subscription for 'b'
     * expected : 3 emitted action, error after 10 F + 10 F = 20 F delay, value after 30 F + 10 F = 40 F delay, and end subscription after 50 F delay
     */
    it('should throw an EffectErrorOccurredAction on error, then proceed to another InitResultListAction, ' +
      'and finish with and FilterAppliedAction', () => {

      const httpError = new HttpErrorResponse({});
      // action
      actions$ = hot('-a-a-b', { a: initResultListAction, b: filterAppliedAction});
      // response
      candidateRepository.searchCandidateProfiles.and.returnValues(
        cold('-#', {}, httpError),
        cold('-c', { c: candidateSearchResult})
      );
      // expected
      const expected = cold('--e-d', {
        e: new EffectErrorOccurredAction({ httpError }),
        d: filterAppliedAction
      });

      expect(sut.initCandidateSearch$).toBeObservable(expected);
    });

  });

  describe('applyFilter$', () => {

    const candidateSearchFilter = initialState.candidateSearchFilter;
    const applyFilterAction = new ApplyFilterAction(candidateSearchFilter);

    const candidateProfile: any = { id: 1 };
    const result = [ candidateProfile as CandidateProfile];

    const candidateSearchResult = { result, totalCount: 10 };
    const filterAppliedAction = new FilterAppliedAction( { page: result, totalCount: 10 });

    const httpError = new HttpErrorResponse({});

    /*
     * action : triggered multiple 'a' applyFilterAction, but only dispatched after 30 F and 80 F delay because of debounce
     * response : value returned after 10 F delay
     * expected : emit 2 results, one after 30 F + 10 F + 30 F debounce = 70 F delay, and other after 80 F + 10 F + 30 F = 120 F delay
     */
    it('should return multiple new FilterAppliedAction on success, including debouncing', () => {

      // action
      actions$ = hot('-a-a----a', { a: applyFilterAction });
      // response
      candidateRepository.searchCandidateProfiles.and.returnValue(cold('-b', { b: candidateSearchResult }));
      // expected
      const expected = cold('-------c----c', { c: filterAppliedAction });

      expect(sut.applyFilter$).toBeObservable(expected);
    });

    /*
     * action : action dispatched after 10 F delay
     * response : return error without any delay
     * expected : emit error result after 10 F + 0 F + 30 F debounce = 40 F delay
     */
    it('should return and EffectErrorOccurredAction on error', () => {

      // action
      actions$ = hot('-a', { a: applyFilterAction });
      // response
      candidateRepository.searchCandidateProfiles.and.returnValue(cold('#', {}, httpError));
      // expected
      const expected = cold('----e', { e: new EffectErrorOccurredAction({ httpError }) });

      expect(sut.applyFilter$).toBeObservable(expected);
    });

    /*
     * action : dispatched only 2 times after 30 F delay and 100 F delay (because of debouncing)
     * response : return error after 10 F delay for 1st response, and value after 10 F delay for 2nd response
     * expected : two emitted results, one error and one successful
     *    1st: after 30 F + 10 F + 30 F debounce = 70 F delay for error
     *    2nd: after 100 F + 10 F + 30 F debounce = 140 F delay for successful result
     */
    it('should return an EffectErrorOccurredAction on error, and after it correct value result', () => {

      // action
      actions$ = hot('-a-a---a--a-', { a: applyFilterAction });
      // response
      candidateRepository.searchCandidateProfiles.and.returnValues(
        cold('-#', {}, httpError),
        cold('-b', { b: candidateSearchResult })
      );
      // expected
      const expected = cold('-------e------c', {
        e: new EffectErrorOccurredAction({ httpError }),
        c: filterAppliedAction
      });

      expect(sut.applyFilter$).toBeObservable(expected);
    });

  });

  describe('applyFilterAndQueryValues$', () => {

    const applyFilterAction = new ApplyFilterAction(initialState.candidateSearchFilter);

    /*
     * action : trigger applyFilterValuesAction after 20 F delay
     * expected : emit applyFilterAction after 20 F delay
     */
    it('should return new ApplyFilterAction when ApplyFilterValues is called', () => {

      const applyFilterValuesAction = new ApplyFilterValuesAction(initialState.candidateSearchFilter as FilterPanelValues);

      // action
      actions$ = hot('--a', { a: applyFilterValuesAction });
      // expected
      const expected = cold('--b', { b: applyFilterAction });

      expect(sut.applyFilterValues$).toBeObservable(expected);
    });

    /*
     * action : trigger applyQueryValuesAction after 20 F delay
     * expected : emit applyFilterAction after 20 F delay
     */
    it('should return new ApplyFilterAction when ApplyQueryValues is called', () => {

      const applyQueryValuesAction = new ApplyQueryValuesAction(initialState.candidateSearchFilter as CandidateQueryPanelValues);

      // action
      actions$ = hot('--a', { a: applyQueryValuesAction });
      // expected
      const expected = cold('--b', { b: applyFilterAction });

      expect(sut.applyQueryValues$).toBeObservable(expected);
    });

  });

  describe('resetFilter$', () => {

    /*
     * action : trigger resetFilterAction after 20 F delay
     * expected : emit both applyFilterAction and filterResetAction in same frame after 20 F delay
     */
    it('should reset filter to initial state', () => {

      const resetFilterAction = new ResetFilterAction({});
      const applyFilterAction = new ApplyFilterAction(initialState.candidateSearchFilter);
      const filterResetAction = new FilterResetAction(initialState.candidateSearchFilter);

      // action
      actions$ = hot('--a', { a: resetFilterAction });
      // expected
      const expected = cold('--(bc)', { b: applyFilterAction, c: filterResetAction });

      expect(sut.resetFilter$).toBeObservable(expected);
    });

  });
  // TODO FAGO: fix these tests to use chisco5
  /* tslint:disable */
  // describe('translateOccupationsOnLanguageChanged$', () => {
  //
  //   const occupCode: OccupationCode = { type: 'SBN5', value: '36102' };
  //   const classificationDE = new OccupationTypeaheadItem(
  //     OccupationTypeaheadItemType.CLASSIFICATION, occupCode, 'Programmierer/innen', 2);
  //   const classificationEN = new OccupationTypeaheadItem(
  //     OccupationTypeaheadItemType.CLASSIFICATION, occupCode, 'Programmers', 2);
  //
  //   const languageChangedAction = new LanguageChangedAction({ language: 'de'});
  //
  //   /*
  //    * action : dispatched languageChangedAction after 10 F delay
  //    * expected : as it is initial state without any occupations, the result should be empty
  //    */
  //   it('should not return anything if no occupation selected', () => {
  //
  //     // action
  //     actions$ = hot('-a--', { a: languageChangedAction });
  //     // expected
  //     const expected = cold('----');
  //
  //     expect(sut.translateOccupationsOnLanguageChanged$).toBeObservable(expected);
  //   });
  //
  //   /*
  //    * first we need to change the currentState of the candidateSearchState ( add occupation in ENGLISH ) and dispatch it
  //    * action : trigger languageChangedAction (to change to GERMAN) after 10 F delay
  //    * response : return array of translated occupation values (in GERMAN) after 10 F delay
  //    * expected : emit the occupationLanguageChangedAction with GERMAN occupation values after 10 F + 10 F = 20 F delay
  //    */
  //   it('should translate occupations on language changed', () => {
  //
  //     const searchFilter: CandidateSearchFilter = {
  //       ...initialState.candidateSearchFilter,
  //       occupations: [ classificationEN ]
  //     };
  //     const applyFilterAction = new ApplyFilterAction(searchFilter);
  //     store.dispatch(applyFilterAction);
  //
  //     // action
  //     actions$ = hot('-a--', { a: languageChangedAction} );
  //
  //     // response
  //     occupationSuggestionService.translateAll.and.returnValue(cold('-b|', { b: [ classificationDE ] }) );
  //
  //     // expected
  //     const occupationLanguageChangedAction = new OccupationLanguageChangedAction( { occupations: [ classificationDE ] });
  //     const expected = cold('--b--', { b: occupationLanguageChangedAction });
  //
  //     expect(sut.translateOccupationsOnLanguageChanged$).toBeObservable(expected);
  //   });
  //
  // });
  /* tslint:enable */

  describe('loadNextPage$', () => {

    const candidateProfile: any = { id: 1 };
    const result = [ candidateProfile as CandidateProfile];

    const candidateSearchResult = { result, totalCount: 10 };
    const loadNextPageAction = new LoadNextPageAction();
    const nextPageLoadedAction = new NextPageLoadedAction({pageNumber: 1, page: result});

    /*
     * action : dispatched loadNextPageAction after 20 F delay
     * response : return result after 10 F delay
     * expected : emit the nextpageLoadedAction after 20 F + 10 F + 30 F debounce = 60 F delay
     */
    it('should load next page', () => {

      // action
      actions$ = hot('--a', { a: loadNextPageAction });
      // response
      candidateRepository.searchCandidateProfiles.and.returnValue(cold('-b', { b: candidateSearchResult }));
      // expected
      const expected = cold('------c', { c: nextPageLoadedAction });

      expect(sut.loadNextPage$).toBeObservable(expected);
    });

    /*
     * action : dispatched only 2 times after 30 F delay and 100 F delay (because of debouncing)
     * response : return error after 10 F delay for 1st response, and value after 10 F delay for 2nd response
     * expected : two emitted results, one error and one successful
     *    1st: after 30 F + 10 F + 30 F debounce = 70 F delay for error
     *    2nd: after 100 F + 10 F + 30 F debounce = 140 F delay for successful result
     */
    it('should throw an EffectErrorOccurredAction when an error, and after it a successful value', () => {

      const httpError = new HttpErrorResponse({});

      // action
      actions$ = hot('-a-a---a--a-', { a: loadNextPageAction });
      // response
      candidateRepository.searchCandidateProfiles.and.returnValues(
        cold('-#', {}, httpError),
        cold('-b', { b: candidateSearchResult })
      );
      // expected
      const expected = cold('-------e------c', {
        e: new EffectErrorOccurredAction({ httpError }),
        c: nextPageLoadedAction
      });

      expect(sut.loadNextPage$).toBeObservable(expected);
    });

  });

  describe('loadPreviousAndNextCandidateProfileDetail$', () => {

    /*
     * action : triggers the loadPreviousCandidateProfileDetailAction
     * response : emit simple result after 10 F delay; id is null because state has no previous value for id
     */
    it('should load previous candidate profile detail', () => {

      const loadPreviousCandidateProfileDetailAction = new LoadPreviousCandidateProfileDetailAction();

      // action
      actions$ = hot('-a', { a: loadPreviousCandidateProfileDetailAction });
      // expected
      const expected = cold('-b', { b: { type: 'nothing' } });

      expect(sut.loadPreviousCandidateProfileDetail$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith(['/candidate-search', null]);
    });

    /*
     * action : 'b' action should be minimum 30 F after 'a' (because of debounce), 'b' is triggered after 50 F delay
     * response : irrelevant because we are triggering response action in H.O. with 'b'
     * expected : emit simple result after 50 F delay, when we get action 'b'
     */
    it('should load next candidate profile detail', () => {

      const id = 'candidate-profile-001';
      const candidateProfile: any = { id };
      const result = [ candidateProfile as CandidateProfile];

      const loadNextCandidateProfileDetailAction = new LoadNextCandidateProfileDetailAction();
      const nextPageLoadedAction = new NextPageLoadedAction({pageNumber: 1, page: result});

      // action
      actions$ = hot('-a---b', { a: loadNextCandidateProfileDetailAction, b: nextPageLoadedAction });
      // expected
      const expected = cold('-----c', { c: { type: 'nothing' } });

      expect(sut.loadNextCandidateProfileDetail$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith(['/candidate-search', id]);
    });

  });

});
