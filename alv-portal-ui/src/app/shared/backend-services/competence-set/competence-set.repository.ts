import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../request-util';
import { Page } from '../shared.types';
import {
  CompetenceSet, CompetenceSetSearchResult,
  CreateCompetenceSet,
  UpdateCompetenceSet
} from './competence-set.types';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';
import { CompetenceElementRepository } from '../competence-element/competence-element.repository';

@Injectable({ providedIn: 'root' })
export class CompetenceSetRepository {

  private readonly resourceUrl = '/competencecatalog-service/api/competence-sets/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient,
              private competenceElementRepository: CompetenceElementRepository) {
  }

  findById(id: string): Observable<CompetenceSetSearchResult> {
    return this.http.get<CompetenceSet>(this.resourceUrl + id).pipe(
      flatMap(competenceSet => {
        return this.competenceElementRepository.findById(competenceSet.knowHowId).pipe(
          map(competenceElement => {
            return <CompetenceSetSearchResult>{
              id: competenceSet.id,
              competenceElementIds: competenceSet.competenceElementIds,
              knowHow: competenceElement,
              draft: competenceSet.draft,
              published: competenceSet.published
            };
          })
        );
      })
    );
  }

  findByCompetenceElementId(competenceElementId: string): Observable<CompetenceSet> {
    return this.http.get<CompetenceSet>(`${this.findUrl}/byCompetenceElementId`, {
      params: new HttpParams().set('id', competenceElementId)
    });
  }

  search(request: PagedSearchRequest): Observable<Page<CompetenceSetSearchResult>> {
    const params = createPageableURLSearchParams(request);
    return this.http.post<Page<CompetenceSetSearchResult>>(this.searchUrl, request.body, {
      params
    });
  }

  create(competenceSet: CreateCompetenceSet): Observable<CompetenceSet> {
    return this.http.post<CompetenceSet>(this.resourceUrl, competenceSet);
  }

  update(id: string, competenceSet: UpdateCompetenceSet): Observable<CompetenceSet> {
    return this.http.put<CompetenceSet>(`${this.resourceUrl}/${id}`, competenceSet);
  }

}
