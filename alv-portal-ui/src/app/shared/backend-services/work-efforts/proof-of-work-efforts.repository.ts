import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProofOfWorkEfforts, WorkEffort } from './proof-of-work-efforts.types';
import { map } from 'rxjs/operators';
import { Page } from '../shared.types';
import { createPageableURLSearchParams, PagedSearchRequest } from '../request-util';

@Injectable({ providedIn: 'root' })
export class ProofOfWorkEffortsRepository {

  private readonly resourceUrl = '/onlineform-service/api/npa';

  private readonly searchUrl = `${this.resourceUrl}/_search`;

  private readonly actionUrl = `${this.resourceUrl}/_action`;

  constructor(private http: HttpClient) {
  }

  search(request: PagedSearchRequest): Observable<Page<ProofOfWorkEfforts>> {
    const params = createPageableURLSearchParams(request);
    return this.http.post<Page<ProofOfWorkEfforts>>(this.searchUrl, request.body, {
      params
    });
  }

  getProofOfWorkEffortsByIdAndFilter(proofOfWorkEffortsId: string, request: PagedSearchRequest): Observable<ProofOfWorkEfforts> {
    return this.http.post<ProofOfWorkEfforts>(`${this.resourceUrl}/${proofOfWorkEffortsId}/_search`, request.body);
  }

  getProofOfWorkEffortsById(proofOfWorkEffortsId: string): Observable<ProofOfWorkEfforts> {
    return this.http.get<ProofOfWorkEfforts>(`${this.resourceUrl}/${proofOfWorkEffortsId}`);
  }

  getWorkEffortById(proofOfWorkEffortsId: string, workEffortId: string): Observable<WorkEffort> {
    return this.getProofOfWorkEffortsById(proofOfWorkEffortsId).pipe(
      map(workEffortReport =>
        workEffortReport.workEfforts.find(workEffort => workEffort.id === workEffortId))
    );
  }

  deleteWorkEffort(proofOfWorkEffortsId: string, workEffortId: string): Observable<null> {
    return this.http.delete<null>(`${this.resourceUrl}/${proofOfWorkEffortsId}/work-efforts/${workEffortId}`);
  }

  addWorkEffort(userId: string, workEffort: WorkEffort): Observable<ProofOfWorkEfforts> {
    return this.http.post<ProofOfWorkEfforts>(`${this.actionUrl}/add-work-effort`, workEffort, {
      params: new HttpParams().set('userId', userId)
    });
  }

  updateWorkEffort(userId: string, workEffort: WorkEffort): Observable<ProofOfWorkEfforts> {
    return this.http.post<ProofOfWorkEfforts>(`${this.actionUrl}/update-work-effort`, workEffort, {
      params: new HttpParams().set('userId', userId)
    });
  }

  submitProofOfWorkEfforts(proofOfWorkEffortsId: string): Observable<null> {
    return this.http.get<null>(`${this.resourceUrl}/${proofOfWorkEffortsId}/submit`);
  }

  downloadPdf(proofOfWorkEffortsId: string): Observable<Blob> {
    return this.http.get(this.resourceUrl + '/' + proofOfWorkEffortsId + '/pdf-document', { responseType: 'blob' });
  }
}
