import { NotificationType } from '../../shared/layout/notifications/notification.model';
import { JobAdvertisement } from '../../shared/backend-services/job-advertisement/job-advertisement.types';
import { Observable } from 'rxjs';
import { JobCenter } from '../../shared/backend-services/reference-service/job-center.types';
import { JobCenterRepository } from '../../shared/backend-services/reference-service/job-center.repository';
import { I18nService } from '../../core/i18n.service';
import { flatMap, map, take } from 'rxjs/operators';
import { InitialFormValueConfig } from './job-publication-form/job-publication-form-value-factory';
import { ActivatedRoute, Router } from '@angular/router';
import { isNotAuthenticatedUser, UserRole } from '../../core/auth/user.model';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { Component, OnInit } from '@angular/core';
import { CoreState } from '../../core/state-management/state/core.state.ts';
import { Store } from '@ngrx/store';
import { IconKey } from '../../shared/icons/custom-icon/custom-icon.component';
import { LinkPanelId } from '../../shared/layout/link-panel/link-panel.component';
import { LayoutConstants } from '../../shared/layout/layout-constants.enum';

@Component({
  selector: 'alv-job-publication',
  templateUrl: './job-publication.component.html',
  styleUrls: ['./job-publication.component.scss']
})
export class JobPublicationComponent implements OnInit {

  UserRole = UserRole;

  LinkPanelId = LinkPanelId;

  IconKey = IconKey;

  LayoutConstants = LayoutConstants;

  initialFormValueConfig$: Observable<InitialFormValueConfig>;

  currentLanguage$: Observable<string>;

  successNotification = {
    type: NotificationType.SUCCESS,
    messageKey: 'portal.job-publication.submit.success',
    isSticky: true
  };

  infoNotification = {
    type: NotificationType.INFO,
    isSticky: true
  };

  submitted = false;

  responsibleJobCenter$: Observable<JobCenter>;

  showLeftColumn$: Observable<boolean>;

  constructor(private jobCenterRepository: JobCenterRepository,
              private i18nService: I18nService,
              private store: Store<CoreState>,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {
    this.initialFormValueConfig$ = route.data.pipe(
      map((data) => data['initialFormValueConfig'])
    );
    this.currentLanguage$ = i18nService.currentLanguage$;
  }

  ngOnInit() {
    this.showLeftColumn$ = this.authenticationService.getCurrentUser().pipe(
      map(user => isNotAuthenticatedUser(user))
    );
  }

  jobPublicationCreated(jobAdvertisement: JobAdvertisement) {
    if (jobAdvertisement.jobCenterCode) {
      this.responsibleJobCenter$ = this.i18nService.currentLanguage$.pipe(
        take(1),
        flatMap(lang => this.jobCenterRepository.resolveJobCenter(jobAdvertisement.jobCenterCode, lang))
      );
    }
    this.submitted = true;
  }

  createNewJobPublication() {
    this.submitted = false;
    this.router.navigate(['job-publication']);
  }
}
