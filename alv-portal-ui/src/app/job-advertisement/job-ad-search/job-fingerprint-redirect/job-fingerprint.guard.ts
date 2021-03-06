import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { JobAdvertisementRepository } from '../../../shared/backend-services/job-advertisement/job-advertisement.repository';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class JobFingerprintGuard implements CanActivate {

  constructor(private jobAdvertisementRepository: JobAdvertisementRepository,
              private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.jobAdvertisementRepository.findByFingerprint(next.queryParams['externalId']).pipe(
      map((job) => {
        this.router.navigate(['/job-search/', job.id]);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['home']);
        return of(false);
      })
    );
  }
}
