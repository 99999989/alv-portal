import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../../request-util';
import { Page } from '../../shared.types';
import {
  CompetenceSet,
  CompetenceSetSearchResult,
  CreateCompetenceSet,
  UpdateCompetenceSet
} from './competence-set.types';
import { flatMap, map, switchMap } from 'rxjs/operators';
import { CompetenceElementRepository } from '../competence-element/competence-element.repository';
import { SearchService } from '../search-service';
import { TriageService } from '../triage.service';

@Injectable({ providedIn: 'root' })
export class CompetenceSetRepository implements SearchService<CompetenceSetSearchResult> {

  private readonly resourceUrl = '/api/competence-sets/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient,
              private competenceElementRepository: CompetenceElementRepository,
              public triageService: TriageService) {

  }

  findById(id: string): Observable<CompetenceSetSearchResult> {
    return this.triageService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.get<CompetenceSet>(endpoint + this.resourceUrl + id).pipe(
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
        )
      ));
  }

  findByCompetenceElementId(competenceElementId: string): Observable<CompetenceSetSearchResult[]> {
    return this.triageService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.get<CompetenceSetSearchResult[]>(endpoint + `${this.findUrl}/byCompetenceElementId`, {
          params: new HttpParams().set('id', competenceElementId)
        })
      ));
  }

  search(request: PagedSearchRequest): Observable<Page<CompetenceSetSearchResult>> {
    const params = createPageableURLSearchParams(request);
    return this.triageService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.post<Page<CompetenceSetSearchResult>>(endpoint + this.searchUrl, request.body, {
          params
        })
      ));
  }

  create(competenceSet: CreateCompetenceSet): Observable<CompetenceSet> {
    return this.triageService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.post<CompetenceSet>(endpoint + this.resourceUrl, competenceSet)
      ));
  }

  update(id: string, competenceSet: UpdateCompetenceSet): Observable<CompetenceSet> {
    return this.triageService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.put<CompetenceSet>(endpoint + `${this.resourceUrl}${id}`, competenceSet)
      ));
  }

  delete(id: string): Observable<void> {
    return this.triageService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.delete<void>(endpoint + `${this.resourceUrl}${id}`)
      ));
  }
}
