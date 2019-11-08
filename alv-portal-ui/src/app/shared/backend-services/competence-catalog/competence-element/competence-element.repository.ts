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

@Injectable({ providedIn: 'root' })
export class CompetenceElementRepository implements SearchService<CompetenceElement> {

  private readonly resourceUrl = '/competencecatalog-service/api/competence-elements/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient) {
  }

  findById(id: string): Observable<CompetenceElement> {
    return this.http.get<CompetenceElement>(this.resourceUrl + id);
  }

  findByIds(ids: string[]): Observable<CompetenceElement[]> {
    return this.http.post<CompetenceElement[]>(`${this.findUrl}/byIds`, ids);
  }

  search(request: PagedSearchRequest): Observable<Page<CompetenceElement>> {
    const params = createPageableURLSearchParams(request);
    return this.http.post<Page<CompetenceElement>>(this.searchUrl, request.body, {
      params
    });
  }

  create(competenceElement: CreateCompetenceElement): Observable<CompetenceElement> {
    return this.http.post<CompetenceElement>(this.resourceUrl, competenceElement);
  }

  update(id: string, competenceElement: UpdateCompetenceElement): Observable<CompetenceElement> {
    return this.http.put<CompetenceElement>(this.resourceUrl + id, competenceElement);
  }

}
