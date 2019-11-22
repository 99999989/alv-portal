import {initialState, JobAdSearchState, JobSearchFilter} from '../state';
import * as jobActions from '../actions/job-ad-search.actions';
import {jobAdSearchReducer} from './job-ad-search.reducers';
import {JobQueryPanelValues} from '../../../../widgets/job-search-widget/job-query-panel/job-query-panel-values';
import {FilterPanelValues} from '../../job-search/filter-panel/filter-panel.component';
import {createJobAdvertisementWithFavourites} from './job-ad-search.reducers.spec-util';
import {JobAdvertisementWithFavourites} from '../../../../shared/backend-services/job-advertisement/job-advertisement.types';
import {
  OccupationTypeaheadItem,
  OccupationTypeaheadItemType
} from '../../../../shared/occupations/occupation-typeahead-item';
import {StringTypeaheadItem} from '../../../../shared/forms/input/typeahead/string-typeahead-item';
import {OccupationCode} from '../../../../shared/backend-services/reference-service/occupation-label.types';
import {
  LocalityInputType,
  LocalityItem,
  LocalityTypeaheadItem
} from '../../../../shared/localities/locality-typeahead-item';
import {ContractType, Sort} from '../../../../shared/backend-services/shared.types';

const COMMUNAL_CODE_BERN = 351;

describe('jobAdSearchReducers', () => {

  /* QUERY PANEL VALUES CHANGED */
  const occupationCode: OccupationCode = {id: 'some-id', type: 'X28', value: '11000976'};
  const localityItem: LocalityItem = {communalCode: COMMUNAL_CODE_BERN};
  const occupation = new OccupationTypeaheadItem(
    OccupationTypeaheadItemType.OCCUPATION, occupationCode, 'Java Applikationsentwickler', 7);
  const keyword = new StringTypeaheadItem('free-text', 'angular', 'angular', 0);
  const locality = new LocalityTypeaheadItem(LocalityInputType.LOCALITY, localityItem, 'Bern', 0);
  const queryPanelValues: JobQueryPanelValues = {
    occupations: [occupation],
    keywords: [keyword],
    localities: [locality]
  };

  /* FILTER PANEL VALUES CHANGED */
  const filterPanelValues: FilterPanelValues = {
    sort: Sort.DATE_ASC,
    displayRestricted: false,
    contractType: ContractType.TEMPORARY,
    workloadPercentageMin: 50,
    workloadPercentageMax: 90,
    company: null,
    onlineSince: 11
  };

  /* JOB ADVERTISEMENT ARRAY */
  const jobAdPageOne: JobAdvertisementWithFavourites[] = [
    createJobAdvertisementWithFavourites('01'),
    createJobAdvertisementWithFavourites('02'),
    createJobAdvertisementWithFavourites('03'),
    createJobAdvertisementWithFavourites('04'),
    createJobAdvertisementWithFavourites('05')
  ];

  /* JOB AD SEARCH STATE */
  const jobAdStateChanged: JobAdSearchState = {
    ...initialState,
    totalCount: 50,
    page: 1,
    resultList: jobAdPageOne,
    jobSearchFilter: {
      ...filterPanelValues,
      ...queryPanelValues
    }
  };

  /*--------------------START--------------------*/

  it('DEFAULT : should not change state for undefined action', () => {
    // GIVEN
    const action = {} as jobActions.Actions;

    // WHEN
    const newState = jobAdSearchReducer(initialState, action);

    // THEN
    expect(newState).toEqual(initialState);
  });

  it('APPLY_QUERY_VALUES : with init = false, should update state with new JobQueryPanelValues', () => {
    // GIVEN
    const action = new jobActions.ApplyQueryValuesAction(queryPanelValues);

    // WHEN
    const newState = jobAdSearchReducer(initialState, action);

    // THEN
    expect(newState.jobSearchFilter.occupations).toEqual(queryPanelValues.occupations);
    expect(newState.jobSearchFilter.keywords).toEqual(queryPanelValues.keywords);
    expect(newState.jobSearchFilter.localities).toEqual(queryPanelValues.localities);

    verifyUnchanged(newState, initialState, ['jobSearchFilter']);
    verifyUnchanged(newState.jobSearchFilter, initialState.jobSearchFilter, ['occupations', 'keywords', 'localities']);
  });

  it('APPLY_QUERY_VALUES : with init = true, should update state with JobQueryPanelValues and return to initial jobSearchFilter values', () => {
    // GIVEN
    const state: JobAdSearchState = {
      ...initialState,
      jobSearchFilter: {
        ...initialState.jobSearchFilter,
        sort: Sort.DATE_ASC,
        contractType: ContractType.TEMPORARY
      }
    };

    const action = new jobActions.ApplyQueryValuesAction(queryPanelValues, true);

    // WHEN
    const newState = jobAdSearchReducer(state, action);

    // THEN
    expect(newState.jobSearchFilter.occupations).toEqual(queryPanelValues.occupations);
    expect(newState.jobSearchFilter.keywords).toEqual(queryPanelValues.keywords);
    expect(newState.jobSearchFilter.localities).toEqual(queryPanelValues.localities);

    expect(newState.jobSearchFilter.sort).toEqual(initialState.jobSearchFilter.sort);
    expect(newState.jobSearchFilter.contractType).toEqual(initialState.jobSearchFilter.contractType);

    verifyUnchanged(newState, initialState, ['jobSearchFilter']);
    verifyUnchanged(newState.jobSearchFilter, initialState.jobSearchFilter, ['occupations', 'keywords', 'localities']);
  });

  it('APPLY_FILTER_VALUES : should update state with new FilterPanelValues', () => {
    // GIVEN
    const jobSearchFilterChanged: JobSearchFilter = {
      ...filterPanelValues,
      occupations: [],
      keywords: [],
      localities: []
    };

    const action = new jobActions.ApplyFilterValuesAction(filterPanelValues);

    // WHEN
    const newState = jobAdSearchReducer(initialState, action);

    // THEN
    expect(newState.jobSearchFilter).toEqual(jobSearchFilterChanged);

    verifyUnchanged(newState, initialState, ['jobSearchFilter']);
  });

  it('APPLY_FILTER : should update jobSearchFilter, page and resultAreLoading', () => {
    // GIVEN
    const payload: JobSearchFilter = {
      ...filterPanelValues,
      ...queryPanelValues
    };

    const action = new jobActions.ApplyFilterAction(payload);

    // WHEN
    const newState = jobAdSearchReducer(initialState, action);

    // THEN
    expect(newState.jobSearchFilter).toEqual(payload);
    expect(newState.page).toBeNumber();
    expect(newState.page).toEqual(0);
    expect(newState.resultsAreLoading).toBeTruthy();
  });

  it('FILTER_APPLIED : it should update Array of JobAdvertisement and totalCount', () => {
    // GIVEN
    const action = new jobActions.FilterAppliedAction({
      page: jobAdPageOne,
      totalCount: 50
    });

    // WHEN
    const newState = jobAdSearchReducer(initialState, action);

    // THEN
    expect(newState.resultList).toBeNonEmptyArray();
    expect(newState.resultList).toBeArrayOfSize(jobAdPageOne.length);
    expect(newState.resultList).toEqual(jobAdPageOne);
    expect(newState.totalCount).toEqual(50);
    expect(newState.resultsAreLoading).toBeFalsy();

    verifyUnchanged(newState, initialState, ['resultList', 'totalCount', 'resultsAreLoading', 'isDirtyResultList']);
  });
  // TODO fago: fix these tests
  // it('OCCUPATION_LANGUAGE_CHANGED_ACTION : should update occupation category for language and value', () => {
  //   // GIVEN
  //   const occupCode: OccupationCode = {id: 'some-id', type: 'SBN3', value: '361'};
  //   const classificationDE = new OccupationTypeaheadItem(
  //     OccupationTypeaheadItemType.CLASSIFICATION, occupCode, 'Berufe der Informatik', 10);
  //   const classificationEN = new OccupationTypeaheadItem(
  //     OccupationTypeaheadItemType.CLASSIFICATION, occupCode, 'IT occupations', 10);
  //   const state: JobAdSearchState = {
  //     ...initialState,
  //     jobSearchFilter: {
  //       ...initialState.jobSearchFilter,
  //       occupations: [classificationDE]
  //     }
  //   };
  //
  //   const action = new jobActions.OccupationLanguageChangedAction({occupations: [classificationEN]});
  //
  //   // WHEN
  //   const newState = jobAdSearchReducer(state, action);
  //
  //   // THEN
  //   expect(newState.jobSearchFilter.occupations).toBeNonEmptyArray();
  //   expect(newState.jobSearchFilter.occupations).toEqual([classificationEN]);
  //
  //   verifyUnchanged(newState, state, ['jobSearchFilter']);
  //   verifyUnchanged(newState.jobSearchFilter, state.jobSearchFilter, ['occupations']);
  // });
  //
  // it('RESET_FILTER : should update filter and query values to their initial state', () => {
  //   // GIVEN
  //   const action = new jobActions.ResetFilterAction({});
  //
  //   // WHAT
  //   const newState = jobAdSearchReducer(jobAdStateChanged, action);
  //
  //   // THEN
  //   expect(newState.jobSearchFilter).toEqual(initialState.jobSearchFilter);
  //
  //   verifyUnchanged(newState, jobAdStateChanged, ['jobSearchFilter']);
  // });
  //
  // it('LOAD_NEXT_PAGE : should only flag true that results are loading', () => {
  //   // GIVEN
  //   const action = new jobActions.LoadNextPageAction();
  //
  //   // WHEN
  //   const newState = jobAdSearchReducer(initialState, action);
  //
  //   //THEN
  //   expect(newState.resultsAreLoading).toBeTruthy();
  //
  //   verifyUnchanged(newState, initialState, ['resultsAreLoading']);
  // });
  //
  // it('NEXT_PAGE_LOADED : should update resultList, page and results are loading flagged false', () => {
  //   // GIVEN
  //   const jobAdPageTwo: JobAdvertisementWithFavourites[] = [
  //     createJobAdvertisementWithFavourites('06'),
  //     createJobAdvertisementWithFavourites('07'),
  //     createJobAdvertisementWithFavourites('08'),
  //     createJobAdvertisementWithFavourites('09'),
  //     createJobAdvertisementWithFavourites('10')
  //   ];
  //
  //   const action = new jobActions.NextPageLoadedAction({page: jobAdPageTwo});
  //
  //   // WHEN
  //   const newState = jobAdSearchReducer(jobAdStateChanged, action);
  //
  //   // THEN
  //   expect(newState.page).toEqual(jobAdStateChanged.page + 1);
  //   expect(newState.resultsAreLoading).toBeFalsy();
  //   expect(newState.resultList).toBeNonEmptyArray();
  //   expect(newState.resultList).toBeArrayOfSize(jobAdStateChanged.resultList.length + jobAdPageTwo.length);
  //
  //   verifyUnchanged(newState, jobAdStateChanged, ['page', 'resultsAreLoading', 'resultList']);
  // });
//   it('JOB_ADVERTISEMENT_DETAIL_LOADED : should update jobAdvertisement and visitedJobAds', () => {
//     // GIVEN
//     const selectedJobAdOne = jobAdPageOne[0];
//     const visitedJobAdOne = { [selectedJobAdOne.jobAdvertisement.id]: true };
//
//     let action = new jobActions.JobAdvertisementDetailLoadedAction({ jobAdvertisement: selectedJobAdOne.jobAdvertisement });
//
//     // WHEN
//     const newStateOne = jobAdSearchReducer(jobAdStateChanged, action);
//
//     // THEN
//     expect(newStateOne.details.jobAdvertisement).toEqual(selectedJobAdOne.jobAdvertisement);
//     expect(newStateOne.visitedJobAds).toEqual(visitedJobAdOne);
//
//     // GIVEN
//     const selectedJobAdTwo = jobAdPageOne[4];
//     const visitedJobAdTwo = { [selectedJobAdOne.jobAdvertisement.id]: true, [selectedJobAdTwo.jobAdvertisement.id]: true };
//
//     action = new jobActions.JobAdvertisementDetailLoadedAction({ jobAdvertisement: selectedJobAdTwo.jobAdvertisement });
//
//     // WHEN
//     const newStateTwo = jobAdSearchReducer(newStateOne, action);
//
//     // THEN
//     expect(newStateTwo.details.jobAdvertisement).toEqual(selectedJobAdTwo.jobAdvertisement);
//     expect(newStateTwo.visitedJobAds).toEqual(visitedJobAdTwo);
//   });
//
//   /*----------------------END----------------------*/
//
// });
//
// // check if key elements of an object are unchanged
  function verifyUnchanged(afterAction: Object, beforeAction: Object, ignoreFields: Array<string>) {
    Object.keys(afterAction)
      .filter((key: string) => ignoreFields.indexOf(key) < 0)
      .forEach((key: string) => {
        expect(afterAction[key]).toEqual(beforeAction[key]);
      });
  }
})
