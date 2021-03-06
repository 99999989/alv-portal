import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApplicationDocument, ApplicationDocumentType,
  CreateApplicationDocument,
} from './application-documents.types';

@Injectable({ providedIn: 'root' })
export class ApplicationDocumentsRepository {

  private readonly resourceUrl = '/onlineform-service/api/bu';

  private readonly searchUrl = `${this.resourceUrl}/_search`;

  /*
    Notice: the upload URL is prepended with "/zuul" to bypass the DispatcherServlet and
    allow files bigger than 1MB to be uploaded.
    @link https://cloud.spring.io/spring-cloud-static/spring-cloud.html#_uploading_files_through_zuul
   */
  private readonly uploadUrl = `/zuul${this.resourceUrl}/`;

  constructor(private http: HttpClient) {
  }

  findByOwnerUserId(userId: string): Observable<ApplicationDocument[]> {
    return this.http.get<ApplicationDocument[]>(`${this.searchUrl}/by-owner-user-id`, {
      params: new HttpParams()
        .set('userId', userId)
    });
  }

  getApplicationDocumentById(id: string): Observable<ApplicationDocument> {
    return this.http.get<ApplicationDocument>(`${this.resourceUrl}/${id}`);
  }

  deleteApplicationDocument(id: string): Observable<null> {
    return this.http.delete<null>(`${this.resourceUrl}/${id}`);
  }

  updateApplicationDocumentType(id: string, type: ApplicationDocumentType): Observable<ApplicationDocument> {
    return this.http.put<ApplicationDocument>(`${this.resourceUrl}/${id}/document-type`, {
      newDocumentType: type
    });
  }

  uploadApplicationDocument(createApplicationDocument: CreateApplicationDocument, file: File): Observable<HttpEvent<ApplicationDocument>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('data', new Blob([JSON.stringify(createApplicationDocument)], { type: 'application/json' }));
    return this.http.post<ApplicationDocument>(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.http.get(`${this.resourceUrl}/${id}/document`, {
      responseType: 'blob'
    });
  }

}
