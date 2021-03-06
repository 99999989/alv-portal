import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { LandingNavigationService } from '../landing-navigation.service';
import { User } from './user.model';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private landingNavigationService: LandingNavigationService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.authenticationService.getCurrentUser()
      .pipe(
        take(1),
        tap((user: User) => this.landingNavigationService.navigateUser(user))
      )
      .subscribe();
    // it looks like we can not return the observable since the navigationUser observable is swallowed
    return true;
  }
}
