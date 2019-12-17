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
import { KK_EDITOR_ENDPOINT } from '../endpoints';

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
    return this.http.post<CompetenceElement[]>(KK_EDITOR_ENDPOINT + `${this.findUrl}/byIds`, ids);
  }

  search(request: PagedSearchRequest): Observable<Page<CompetenceElement>> {
    const params = createPageableURLSearchParams(request);
    return this.http.post<Page<CompetenceElement>>(KK_EDITOR_ENDPOINT + this.searchUrl, request.body, {
      params
    });
  }

  create(competenceElement: CreateCompetenceElement): Observable<CompetenceElement> {
    return this.http.post<CompetenceElement>(KK_EDITOR_ENDPOINT + this.resourceUrl, competenceElement);
  }

  update(id: string, competenceElement: UpdateCompetenceElement): Observable<CompetenceElement> {
    return this.http.put<CompetenceElement>(KK_EDITOR_ENDPOINT + this.resourceUrl + id, competenceElement);
  }

  delete(competenceElementId: string): Observable<void> {
    return this.http.delete<void>(KK_EDITOR_ENDPOINT + `${this.resourceUrl}${competenceElementId}`);
  }

}
