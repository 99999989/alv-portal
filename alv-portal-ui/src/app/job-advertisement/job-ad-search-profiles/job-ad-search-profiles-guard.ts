import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { JobAdSearchProfilesRepository } from '../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.repository';
import { NotificationsService } from '../../core/notifications.service';
import {
  switchMap,
  take
} from 'rxjs/operators';
import { isAuthenticatedUser } from '../../core/auth/user.model';
import {
  Observable,
  of
} from 'rxjs';

@Injectable()
export class JobAdSearchProfilesGuard implements CanActivate {

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private jobAdSearchProfilesRepository: JobAdSearchProfilesRepository,
              private notificationService: NotificationsService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const id = route.params['id'];
    const token = route.queryParams['token'];
    return this.authenticationService.getCurrentUser().pipe(
      take(1),
      switchMap(currentUser => {
        if (isAuthenticatedUser(currentUser)) {
          this.router.navigate(['job-search-profiles']);
          return of(true);
        } else {
          this.jobAdSearchProfilesRepository.disableJobAlert(id, token).subscribe();
          this.router.navigate(['']);
          this.notificationService.success('Job-Alert deactivated');
          return of(true);
        }
      }));
  }
}
