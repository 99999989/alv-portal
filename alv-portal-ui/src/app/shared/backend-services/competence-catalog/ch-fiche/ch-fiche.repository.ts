import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../../request-util';

import { Page } from '../../shared.types';
import { ChFiche, CreateChFiche, UpdateChFiche } from './ch-fiche.types';
import { SearchService } from '../search-service';

@Injectable({ providedIn: 'root' })
export class ChFicheRepository implements SearchService<ChFiche> {

  private readonly resourceUrl = '/competencecatalogservice-editor/api/ch-fiches/';

  private readonly searchUrl = `${this.resourceUrl}_search`;
  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient) {
  }

  findById(id: string): Observable<ChFiche> {
    return this.http.get<ChFiche>(this.resourceUrl + id);
  }

  search(request: PagedSearchRequest): Observable<Page<ChFiche>> {

    const params = createPageableURLSearchParams(request);
    return this.http.post<Page<ChFiche>>(this.searchUrl, request.body, {
      params
    });
  }

  findByCompetenceSetId(competenceSetId: string): Observable<ChFiche[]> {
    return this.http.get<ChFiche[]>(this.findUrl + '/byCompetenceSetId', {
      params: new HttpParams().set('id', competenceSetId)
    });
  }

  findByRequirementId(requirementId: string): Observable<ChFiche[]> {
    return this.http.get<ChFiche[]>(this.findUrl + '/byRequirementId', {
      params: new HttpParams().set('id', requirementId)
    });
  }


  create(chFiche: CreateChFiche): Observable<ChFiche> {
    return this.http.post<ChFiche>(this.resourceUrl, chFiche);
  }

  update(id: string, chFiche: UpdateChFiche): Observable<ChFiche> {
    return this.http.put<ChFiche>(this.resourceUrl + id, chFiche);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.resourceUrl + id);
  }

}
