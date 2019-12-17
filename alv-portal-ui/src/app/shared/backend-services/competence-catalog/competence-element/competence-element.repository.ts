import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../../request-util';
import {
  CompetenceElement,
  CreateCompetenceElement,
  UpdateCompetenceElement
} from './competence-element.types';
import { Page } from '../../shared.types';
import { SearchService } from '../search-service';
import { TriageService } from '../triage.service';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CompetenceElementRepository implements SearchService<CompetenceElement> {

  private readonly resourceUrl = '/api/competence-elements/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient,
              public triageService: TriageService) {
  }

  findById(id: string): Observable<CompetenceElement> {
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.get<CompetenceElement>(endpoint + this.resourceUrl + id))
    );

  }

  findByIds(ids: string[]): Observable<CompetenceElement[]> {
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.post<CompetenceElement[]>(endpoint + `${this.findUrl}/byIds`, ids))
    );

  }

  search(request: PagedSearchRequest): Observable<Page<CompetenceElement>> {
    const params = createPageableURLSearchParams(request);
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.post<Page<CompetenceElement>>(endpoint + this.searchUrl, request.body, {
        params
      })));

  }

  create(competenceElement: CreateCompetenceElement): Observable<CompetenceElement> {
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.post<CompetenceElement>(endpoint + this.resourceUrl, competenceElement))
    );
  }

  update(id: string, competenceElement: UpdateCompetenceElement): Observable<CompetenceElement> {
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.put<CompetenceElement>(endpoint + this.resourceUrl + id, competenceElement))
    );
  }

  delete(competenceElementId: string): Observable<void> {
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.delete<void>(endpoint + `${this.resourceUrl}${competenceElementId}`))
    );
  }

}
