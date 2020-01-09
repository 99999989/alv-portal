import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../../request-util';
import { CreateRequirement, Requirement, UpdateRequirement } from './requirement.types';
import { Page } from '../../shared.types';
import { SearchService } from '../search-service';

@Injectable({ providedIn: 'root' })
export class RequirementRepository implements SearchService<Requirement> {

  private readonly resourceUrl = '/competencecatalogservice-editor/api/work-requirements/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient) {
  }

  findById(id: string): Observable<Requirement> {
    return this.http.get<Requirement>(this.resourceUrl + id);
  }

  findByIds(ids: string[]): Observable<Requirement[]> {
    return this.http.post<Requirement[]>(`${this.findUrl}/byIds`, ids);
  }

  search(request: PagedSearchRequest): Observable<Page<Requirement>> {
    const params = createPageableURLSearchParams(request);
    return this.http.post<Page<Requirement>>(this.searchUrl, request.body, {
      params
    });
  }

  create(requirement: CreateRequirement): Observable<Requirement> {
    return this.http.post<Requirement>(this.resourceUrl, requirement);
  }

  update(id: string, requirement: UpdateRequirement): Observable<Requirement> {
    return this.http.put<Requirement>(this.resourceUrl + id, requirement);
  }

  delete(requirementId: string): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}${requirementId}`);
  }

}
