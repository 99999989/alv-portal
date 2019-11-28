import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import {
  OccupationLabelAutocomplete,
  OccupationLabelData
} from './occupation-label.types';
import { catchError, map, shareReplay } from 'rxjs/operators';

const DEFAULT_RESPONSE_SIZE = '10';
const BUFFER_SIZE = 1;

const OCCUPATION_LABEL_RESOURCE_SEARCH_URL_V1 = '/referenceservice/api/_search/occupations/label';

const OCCUPATION_LABEL_RESOURCE_SEARCH_URL_V2 = '/referenceservice-2/api/_search/occupations/label';

const OCCUPATION_LABEL_RESOURCE_URL_V1 = '/referenceservice/api/occupations/label';

const OCCUPATION_LABEL_RESOURCE_URL_V2 = '/referenceservice-2/api/occupations/label';

export enum OccupationTypes {
  AVAM = 'AVAM',
  X28 = 'X28',
  SBN3 = 'SBN3',
  SBN5 = 'SBN5',
  BFS = 'BFS',
  CHISCO3 = 'CHISCO3',
  CHISCO5 = 'CHISCO5',
}

export enum REFERENCE_SERVICE_API_VERSION {
  V_1,
  V_2
}

@Injectable({ providedIn: 'root' })
export class OccupationLabelRepository {

  private occupationLabelDataCache: { [key: string]: Observable<OccupationLabelData> } = {};

  constructor(private http: HttpClient) {
  }

  getOccupationLabelsByKey(type: string, value: string, language: string, apiVersion = REFERENCE_SERVICE_API_VERSION.V_1): Observable<OccupationLabelData> {
    const cacheKey = `${type}_${value}_${language}`;

    const url = apiVersion === REFERENCE_SERVICE_API_VERSION.V_1
      ? OCCUPATION_LABEL_RESOURCE_URL_V1
      : OCCUPATION_LABEL_RESOURCE_URL_V2;

    if (!this.occupationLabelDataCache[cacheKey]) {
      // we cache the observable itself instead of the resolved value because the function is likely to be called in a loop
      this.occupationLabelDataCache[cacheKey] = this.http.get<OccupationLabelData>(`${url}/${type}/${value}`).pipe(
        shareReplay(BUFFER_SIZE),
        catchError(err => {
          delete this.occupationLabelDataCache[cacheKey];
          return EMPTY;
        })
      );
    }
    return this.occupationLabelDataCache[cacheKey];
  }

  /**
   *
   * @param query the query/term
   * @param types of 'x28', 'sbn3', 'sbn5'
   * @param apiVersion REFERENCE_SERVICE_API_VERSION.V_1 or REFERENCE_SERVICE_API_VERSION.V_2 default is REFERENCE_SERVICE_API_VERSION.V_1
   */
  suggestOccupations(query: string, types: OccupationTypes[], apiVersion: REFERENCE_SERVICE_API_VERSION): Observable<OccupationLabelAutocomplete> {
    const params = new HttpParams()
      .set('prefix', query)
      .set('types', types.join(','))
      .set('resultSize', DEFAULT_RESPONSE_SIZE);

    const url = apiVersion === REFERENCE_SERVICE_API_VERSION.V_1
      ? OCCUPATION_LABEL_RESOURCE_SEARCH_URL_V1
      : OCCUPATION_LABEL_RESOURCE_SEARCH_URL_V2;

    return this.http.get<OccupationLabelAutocomplete>(url, { params }).pipe(
      map((dirtyOccupations) => this.removeNonMatchingOccupationTypes(dirtyOccupations, types)));
  }

  /**
   * todo now we filter it on a frontend to hide the bug on reference services, but when the task DF-1865 is solved we don't need to do it
   * @param dirtyOccupations
   * @param types
   */
  removeNonMatchingOccupationTypes(dirtyOccupations: OccupationLabelAutocomplete, types: OccupationTypes[]): OccupationLabelAutocomplete {
    return {
      occupations: dirtyOccupations.occupations.filter(o => types.includes(<OccupationTypes>o.type)),
      classifications: dirtyOccupations.classifications.filter(c => types.includes(<OccupationTypes>c.type))
    };
  }
}
