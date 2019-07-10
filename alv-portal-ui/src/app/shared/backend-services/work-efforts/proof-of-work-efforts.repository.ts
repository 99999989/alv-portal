import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProofOfWorkEfforts, WorkEffort } from './proof-of-work-efforts.types';
import { map } from 'rxjs/operators';
import { Page } from '../shared.types';

@Injectable({ providedIn: 'root' })
export class ProofOfWorkEffortsRepository {

  private readonly resourceUrl = '/onlineform-service/api/npa';

  private readonly searchUrl = `${this.resourceUrl}/_search`;

  private readonly actionUrl = `${this.resourceUrl}/_action`;

  constructor(private http: HttpClient) {
  }

  findByOwnerUserId(userId: string, page: number): Observable<ProofOfWorkEfforts[]> {
    return this.http.get<Page<ProofOfWorkEfforts>>(`${this.searchUrl}/by-owner-user-id`, {
      params: new HttpParams()
        .set('userId', userId)
        .set('page', page.toString())
    }).pipe(
      map(result => result.content)
    );
  }

  getProofOfWorkEffortsById(workEffortReportId: string): Observable<ProofOfWorkEfforts> {
    return this.http.get<ProofOfWorkEfforts>(`${this.resourceUrl}/${workEffortReportId}`);
  }

  getWorkEffortById(workEffortReportId: string, workEffortId: string): Observable<WorkEffort> {
    return this.getProofOfWorkEffortsById(workEffortReportId).pipe(
      map(workEffortReport =>
        workEffortReport.workEfforts.find(workEffort => workEffort.id === workEffortId))
    );
  }

  deleteWorkEffort(workEffortsReportId: string, workEffortId: string): Observable<null> {
    return this.http.delete<null>(`${this.resourceUrl}/${workEffortsReportId}/work-efforts/${workEffortId}`);
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

  downloadPdf(proofOfWorkEffortsId: string): Observable<Blob> {
    return this.http.get(this.resourceUrl + '/' + proofOfWorkEffortsId + '/pdf-document', { responseType: 'blob' });
  }
}
