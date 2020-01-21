import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../../request-util';
import {
  CreateWorkEnvironment,
  UpdateWorkEnvironment,
  WorkEnvironment
} from './work-environment.types';
import { Page } from '../../shared.types';
import { SearchService } from '../search-service';
import { KkRoleConditionRoutingService } from '../kk-role-condition-routing.service';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WorkEnvironmentRepository implements SearchService<WorkEnvironment> {

  private readonly resourceUrl = '/competencecatalogservice-editor/api/work-environments/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient,
              public roleConditionRoutingService: KkRoleConditionRoutingService) {
  }

  findById(id: string): Observable<WorkEnvironment> {
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.get<WorkEnvironment>(this.resourceUrl + id))
    );
  }

  findByIds(ids: string[]): Observable<WorkEnvironment[]> {
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.post<WorkEnvironment[]>(`${this.findUrl}/byIds`, ids))
    );
  }

  search(request: PagedSearchRequest): Observable<Page<WorkEnvironment>> {

    const params = createPageableURLSearchParams(request);
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.post<Page<WorkEnvironment>>(this.searchUrl, request.body, { params }))
    );
  }

  create(workEnvironment: CreateWorkEnvironment): Observable<WorkEnvironment> {
    return this.http.post<WorkEnvironment>(this.resourceUrl, workEnvironment);
  }

  update(id: string, workEnvironment: UpdateWorkEnvironment): Observable<WorkEnvironment> {
    return this.http.put<WorkEnvironment>(this.resourceUrl + id, workEnvironment);
  }

  delete(workEnvironmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.resourceUrl}${workEnvironmentId}`);
  }

}
