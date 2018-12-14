import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs/index';
import { JobAdSearchState } from '../state-management/state/job-ad-search.state';
import { Store } from '@ngrx/store';
import { JobAdvertisementDetailLoadedAction } from '../state-management/actions/job-ad-search.actions';
import { catchError, map, tap } from 'rxjs/internal/operators';
import { JobAdvertisementRepository } from '../../shared/backend-services/job-advertisement/job-advertisement.repository';
import { Injectable } from '@angular/core';

@Injectable()
export class JobDetailGuard implements CanActivate {

  constructor(private store: Store<JobAdSearchState>, private jobAdvertisementService: JobAdvertisementRepository) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const id = route.params['id'];
    return this.jobAdvertisementService.findById(id).pipe(
      tap((jobAd) => {
        this.store.dispatch(new JobAdvertisementDetailLoadedAction({ jobAdvertisement: jobAd }));
      }),
      map(() => {
        return true;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }

}