import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../../request-util';

import { Page } from '../../shared.types';
import { ChFiche, CreateChFiche, UpdateChFiche } from './ch-fiche.types';
import { SearchService } from '../search-service';
import { KK_EDITOR_ENDPOINT } from '../endpoints';
import { switchMap } from 'rxjs/operators';
import { TriageService } from '../triage.service';

@Injectable({ providedIn: 'root' })
export class ChFicheRepository implements SearchService<ChFiche> {

  private readonly resourceUrl = '/api/ch-fiches/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient,
              public triageService: TriageService) {
  }

  findById(id: string): Observable<ChFiche> {
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.get<ChFiche>(endpoint + this.resourceUrl + id))
    );
  }

  search(request: PagedSearchRequest): Observable<Page<ChFiche>> {

    const params = createPageableURLSearchParams(request);
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.post<Page<ChFiche>>(endpoint + this.searchUrl, request.body, {
        params
      }))
    );
  }

  findByCompetenceSetId(competenceSetId: string): Observable<ChFiche[]> {
    return this.triageService.endpoint$.pipe(
      switchMap(endpoint => this.http.get<ChFiche[]>(endpoint + this.findUrl + '/byCompetenceSetId', {
        params: new HttpParams().set('id', competenceSetId)
      })));
  }

  create(chFiche: CreateChFiche): Observable<ChFiche> {
    return this.http.post<ChFiche>(KK_EDITOR_ENDPOINT + this.resourceUrl, chFiche);
  }

  update(id: string, chFiche: UpdateChFiche): Observable<ChFiche> {
    return this.http.put<ChFiche>(KK_EDITOR_ENDPOINT + this.resourceUrl + id, chFiche);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(KK_EDITOR_ENDPOINT + this.resourceUrl + id);
  }

}
