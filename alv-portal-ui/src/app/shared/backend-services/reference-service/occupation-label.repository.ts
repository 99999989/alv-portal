import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import {
  OccupationLabelAutocomplete,
  OccupationLabelData
} from './occupation-label.types';
import { catchError, shareReplay } from 'rxjs/operators';

const DEFAULT_RESPONSE_SIZE = '10';
const BUFFER_SIZE = 1;

const OCCUPATION_LABEL_RESOURCE_SEARCH_URL = '/referenceservice/api/_search/occupations/label';

const OCCUPATION_LABEL_RESOURCE_URL = '/referenceservice/api/occupations/label';

export enum OccupationTypes {
  AVAM = 'AVAM',
  X28 = 'X28',
  SBN3 = 'SBN3',
  SBN5 = 'SBN5',
  BFS = 'BFS',
  CHISCO3 = 'CHISCO3',
  CHISCO5 = 'CHISCO5',
}

@Injectable({ providedIn: 'root' })
export class OccupationLabelRepository {

  private occupationLabelDataCache: { [key: string]: Observable<OccupationLabelData> } = {};

  constructor(private http: HttpClient) {
  }

  getOccupationLabelsByKey(type: string, value: string, language: string): Observable<OccupationLabelData> {
    const cacheKey = `${type}_${value}_${language}`;
    if (!this.occupationLabelDataCache[cacheKey]) {
      // we cache the observable itself instead of the resolved value because the function is likely to be called in a loop
      this.occupationLabelDataCache[cacheKey] = this.http.get<OccupationLabelData>(`${OCCUPATION_LABEL_RESOURCE_URL}/${type}/${value}`).pipe(
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
   * @param types of [x28', 'sbn3', 'sbn5'
   */
  suggestOccupations(query: string, types: OccupationTypes[]): Observable<OccupationLabelAutocomplete> {
    const params = new HttpParams()
      .set('prefix', query)
      .set('types', types.join(','))
      .set('resultSize', DEFAULT_RESPONSE_SIZE);
    return this.http.get<OccupationLabelAutocomplete>(OCCUPATION_LABEL_RESOURCE_SEARCH_URL, { params });
  }
}
