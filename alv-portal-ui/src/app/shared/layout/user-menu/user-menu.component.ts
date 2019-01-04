import { Component, Inject, Input, OnInit } from '@angular/core';
import { User } from '../../../core/auth/user.model';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LandingNavigationService } from '../../../core/landing-navigation.service';
import { DOCUMENT, Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Company } from '../../backend-services/company/company.types';
import { CompanyContactTemplate } from '../../backend-services/user-info/user-info.types';

@Component({
  selector: 'alv-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  hideRegistrationAction: boolean;
  private readonly FINISH_REGISTRATION_URL = '/registration/finish';

  private readonly ACCESS_CODE_URL = '/registration/access-code';

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private location: Location,
              private activatedRoute: ActivatedRoute,
              private landingNavigationService: LandingNavigationService,
              @Inject(DOCUMENT) private document: any) {
  }

  private _user: User;

  @Input() noEiam: boolean;

  get user() {
    return this._user;
  }

  @Input() set user(user: User) {
    this._user = user;
    this.hideRegistrationAction = this.user.isRegistered();
  }

  @Input() company: CompanyContactTemplate;

  ngOnInit() {
    this.subscribeOnRouteChanges();
  }

  logout() {
    this.authenticationService.logout();
    if (!this.noEiam) {
      this.document.location.href = '/authentication/logout';
    } else {
      this.router.navigate(['']);
    }
  }

  goToEiamProfile() {
    this.document.location.href = '/authentication/profile';
  }

  completeRegistration() {
    this.landingNavigationService.navigateUser(this.user);
  }

  private subscribeOnRouteChanges() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (!this.user.isRegistered()) {
        this.hideRegistrationAction = this.location.isCurrentPathEqualTo(this.FINISH_REGISTRATION_URL) ||
          this.location.isCurrentPathEqualTo(this.ACCESS_CODE_URL);
      }
    });
  }
}
