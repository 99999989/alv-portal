import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { map } from 'rxjs/operators';
import { createPageableURLSearchParams } from '../request-util';
import {
  CreateJobAdSearchProfile,
  JobAdSearchProfileResult,
  JobAdSearchProfilesSearchResponse,
  JobAlertDto,
  ResolvedJobAdSearchProfile,
  UpdateJobAdSearchProfile
} from './job-ad-search-profiles.types';

@Injectable({ providedIn: 'root' })
export class JobAdSearchProfilesRepository {

  private readonly resourceUrl = '/jobadservice/api/searchProfiles';

  private readonly resourceUrlJobAlert = '/jobadservice/api/searchProfiles/jobalert';

  private readonly searchUrl = `${this.resourceUrl}/_search`;

  constructor(private http: HttpClient) {
  }

  create(jobAdSearchProfile: CreateJobAdSearchProfile): Observable<ResolvedJobAdSearchProfile> {
    return this.http.post<ResolvedJobAdSearchProfile>(this.resourceUrl, jobAdSearchProfile);
  }

  update(jobAdSearchProfileId: string, jobAdSearchProfile: UpdateJobAdSearchProfile): Observable<ResolvedJobAdSearchProfile> {
    return this.http.put<ResolvedJobAdSearchProfile>(this.resourceUrl + '/' + jobAdSearchProfileId, jobAdSearchProfile);
  }

  delete(jobAdSearchProfileId: string): Observable<void> {
    return this.http.delete<void>(this.resourceUrl + '/' + jobAdSearchProfileId);
  }

  search(ownerUserId: string, page = 0, size = 10): Observable<JobAdSearchProfilesSearchResponse> {
    let params = createPageableURLSearchParams({ page: page, size: size });
    params = params.set('ownerUserId', ownerUserId);
    return this.http.get<JobAdSearchProfileResult[]>(this.searchUrl, {
      params,
      observe: 'response'
    }).pipe(
      map((resp) => {
        return {
          totalCount: parseInt(resp.headers.get('X-Total-Count'), 10),
          result: resp.body
        };
      }));
  }

  findById(id: string): Observable<ResolvedJobAdSearchProfile> {
    return this.http.get<ResolvedJobAdSearchProfile>(`${this.resourceUrl}/${id}`);
  }

  enableJobAlert(jobAlert: JobAlertDto): Observable<JobAdSearchProfileResult> {
    return this.http.post<JobAdSearchProfileResult>(`${this.resourceUrlJobAlert}/${jobAlert.searchProfileId}`, jobAlert);
  }

  disableJobAlert(id: string): Observable<ResolvedJobAdSearchProfile> {
    return this.http.get<ResolvedJobAdSearchProfile>(`${this.resourceUrl}/${id}`);
  }

}
