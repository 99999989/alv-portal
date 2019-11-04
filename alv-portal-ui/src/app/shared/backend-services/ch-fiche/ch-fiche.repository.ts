import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../request-util';

import { Page } from '../shared.types';
import { ChFiche, CreateChFiche, UpdateChFiche } from './ch-fiche.types';

@Injectable({ providedIn: 'root' })
export class ChFicheRepository {

  private readonly resourceUrl = '/competencecatalog-service/api/ch-fiches/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

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

  create(chFiche: CreateChFiche): Observable<ChFiche> {
    return this.http.post<ChFiche>(this.resourceUrl, chFiche);
  }

  update(id: string, chFiche: UpdateChFiche): Observable<ChFiche> {
    return this.http.put<ChFiche>(this.resourceUrl + id, chFiche);
  }

}
