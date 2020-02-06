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
import { KkRoleConditionRoutingService } from '../kk-role-condition-routing.service';
import { switchMap } from 'rxjs/operators';
import { KK_EDITOR_ENDPOINT } from '../endpoints';

@Injectable({ providedIn: 'root' })
export class PrerequisiteRepository implements SearchService<Prerequisite> {

  private readonly resourceUrl = '/api/prerequisites/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient,
              public roleConditionRoutingService: KkRoleConditionRoutingService) {
  }

  findById(id: string): Observable<Prerequisite> {
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.get<Prerequisite>(endpoint + this.resourceUrl + id))
    );
  }

  findByIds(ids: string[]): Observable<Prerequisite[]> {
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.post<Prerequisite[]>(endpoint + `${this.findUrl}/byIds`, ids))
    );
  }

  search(request: PagedSearchRequest): Observable<Page<Prerequisite>> {

    const params = createPageableURLSearchParams(request);
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.post<Page<Prerequisite>>(endpoint + this.searchUrl, request.body, { params }))
    );
  }

  create(prerequisite: CreatePrerequisite): Observable<Prerequisite> {
    return this.http.post<Prerequisite>(KK_EDITOR_ENDPOINT + this.resourceUrl, prerequisite);
  }

  update(id: string, prerequisite: UpdatePrerequisite): Observable<Prerequisite> {
    return this.http.put<Prerequisite>(KK_EDITOR_ENDPOINT + this.resourceUrl + id, prerequisite);
  }

  delete(prerequisiteId: string): Observable<void> {
    return this.http.delete<void>(KK_EDITOR_ENDPOINT + `${this.resourceUrl}${prerequisiteId}`);
  }

}
