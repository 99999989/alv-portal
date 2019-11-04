import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  isAnonymous,
  isAnyUser,
  isInValidation,
  isUnregistered,
  User,
  UserRole
} from './auth/user.model';
import { AppContextService } from './app-context/app-context.service';
import { flatMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { UserNavigationStrategy } from './user-navigation.strategy';

@Injectable({
  providedIn: 'root'
})
export class LandingNavigationService {

  private userNavigationStrategies: UserNavigationStrategy[] = [
    {
      matches: isAnonymous,
      navigate: () => this.navigateHome()
    },
    {
      matches: isUnregistered,
      navigate: () => this.router.navigate(['registration', 'finish'])
    },
    {
      matches: isInValidation,
      navigate: () => this.router.navigate(['registration', 'access-code'])
    },
    {
      matches: user => user.hasAnyAuthorities([UserRole.ROLE_JOB_SEEKER]),
      navigate: () => this.router.navigate(['dashboard', 'job-seeker'])
    },
    {
      matches: user => user.hasAnyAuthorities([UserRole.ROLE_COMPANY]),
      navigate: () => this.router.navigate(['dashboard', 'company'])
    },
    {
      matches: user => user.hasAnyAuthorities([UserRole.ROLE_PAV]),
      navigate: () => this.router.navigate(['dashboard', 'pav'])
    },
    {
      matches: user => user.hasAnyAuthorities([UserRole.ROLE_ADMIN, UserRole.ROLE_SYSADMIN]),
      navigate: () => this.router.navigate(['dashboard', 'admin'])
    },
    {
      matches: user => user.hasAnyAuthorities([UserRole.ROLE_KK_EDITOR]),
      navigate: () => this.router.navigate(['kk', 'ch-fiches'])
    },
    {
      matches: isAnyUser,
      navigate: () => {
        throw new Error('User could not be navigated because no matching USER_ROLE was found.');
      }
    }
  ];

  constructor(private router: Router,
              private appContextService: AppContextService) {
  }

  navigateHome(): Promise<boolean> {
    return this.appContextService.getHomeUrl()
      .pipe(
        flatMap(homeUrl => fromPromise(this.router.navigate(homeUrl)))
      )
      .toPromise();
  }

  navigateUser(user: User): Promise<boolean> {
    return this.userNavigationStrategies
      .find(strategy => strategy.matches(user))
      .navigate();
  }
}


