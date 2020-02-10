import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createPageableURLSearchParams, PagedSearchRequest } from '../../request-util';
import { CreateSoftskill, Softskill, UpdateSoftskill } from './softskill.types';
import { Page } from '../../shared.types';
import { SearchService } from '../search-service';
import { KkRoleConditionRoutingService } from '../kk-role-condition-routing.service';
import { switchMap } from 'rxjs/operators';
import { KK_EDITOR_ENDPOINT } from '../endpoints';

@Injectable({ providedIn: 'root' })
export class SoftskillRepository implements SearchService<Softskill> {

  private readonly resourceUrl = '/api/softskills/';

  private readonly searchUrl = `${this.resourceUrl}_search`;

  private readonly findUrl = `${this.resourceUrl}_find`;

  constructor(private http: HttpClient,
              public roleConditionRoutingService: KkRoleConditionRoutingService) {
  }

  findById(id: string): Observable<Softskill> {
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.get<Softskill>(endpoint + this.resourceUrl + id))
    );
  }

  findByIds(ids: string[]): Observable<Softskill[]> {
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.post<Softskill[]>(endpoint + `${this.findUrl}/byIds`, ids))
    );
  }

  search(request: PagedSearchRequest): Observable<Page<Softskill>> {

    const params = createPageableURLSearchParams(request);
    return this.roleConditionRoutingService.endpoint$.pipe(
      switchMap(
        endpoint => this.http.post<Page<Softskill>>(endpoint + this.searchUrl, request.body, { params }))
    );
  }

  create(softskill: CreateSoftskill): Observable<Softskill> {
    return this.http.post<Softskill>(KK_EDITOR_ENDPOINT + this.resourceUrl, softskill);
  }

  update(id: string, softskill: UpdateSoftskill): Observable<Softskill> {
    return this.http.put<Softskill>(KK_EDITOR_ENDPOINT + this.resourceUrl + id, softskill);
  }

  delete(softskillId: string): Observable<void> {
    return this.http.delete<void>(KK_EDITOR_ENDPOINT + `${this.resourceUrl}${softskillId}`);
  }

}
