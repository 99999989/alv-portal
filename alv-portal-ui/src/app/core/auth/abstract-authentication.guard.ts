import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { LandingNavigationService } from '../landing-navigation.service';

export abstract class AbstractAuthenticationGuard implements CanActivate, CanActivateChild {

  protected constructor(private authenticationService: AuthenticationService,
                        private landingNavigationService: LandingNavigationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivateRoute();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivateRoute();
  }

  private canActivateRoute(): Observable<boolean> {
    return this.authenticationService.getCurrentUser()
      .pipe(
        map((user) => {
          const result = this.predicate(user);
          if (!result) {
            this.onPredicateFailed(user);
          }
          return result;
        })
      );
  }

  protected abstract predicate(user: User): boolean;

  protected onPredicateFailed(user: User): void {
    this.landingNavigationService.navigateUser(user);
  }
}
