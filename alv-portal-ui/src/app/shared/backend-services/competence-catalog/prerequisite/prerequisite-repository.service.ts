import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../../request-util';
import {
  CreatePrerequisite,
  Prerequisite,
  UpdatePrerequisite
} from './prerequisite.types';
import { Page } from '../../shared.types';
import { SearchService } from '../search-service';

@Injectable({ providedIn: 'root' })
export class PrerequisiteRepository implements SearchService<Prerequisite> {

  private readonly resourceUrl = '/competencecatalogservice-editor/api/requirements/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient) {
  }

  findById(id: string): Observable<Prerequisite> {
    return this.http.get<Prerequisite>(this.resourceUrl + id);
  }

  findByIds(ids: string[]): Observable<Prerequisite[]> {
    return this.http.post<Prerequisite[]>(`${this.findUrl}/byIds`, ids);
  }

  search(request: PagedSearchRequest): Observable<Page<Prerequisite>> {
    const params = createPageableURLSearchParams(request);
    return this.http.post<Page<Prerequisite>>(this.searchUrl, request.body, {
      params
    });
  }

  create(requirement: CreatePrerequisite): Observable<Prerequisite> {
    return this.http.post<Prerequisite>(this.resourceUrl, requirement);
  }

  update(id: string, requirement: UpdatePrerequisite): Observable<Prerequisite> {
    return this.http.put<Prerequisite>(this.resourceUrl + id, requirement);
  }

  delete(requirementId: string): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}${requirementId}`);
  }

}
