import { Component, OnInit } from '@angular/core';
import { IconKey } from '../../shared/icons/custom-icon/custom-icon.component';
import { JobAdSearchProfilesRepository } from '../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.repository';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { flatMap, take } from 'rxjs/operators';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { NotificationsService } from '../../core/notifications.service';
import { JobAdSearchProfileResult } from '../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.types';
import { getJobAdDeleteConfirmModalConfig } from '../../shared/search-profiles/modal-config.types';
import { SearchProfile } from '../../shared/backend-services/shared.types';
import { removeSearchProfileAnimation } from '../../shared/animations/animations';

@Component({
  selector: 'alv-job-search-profiles-widget',
  templateUrl: './job-search-profiles-widget.component.html',
  styleUrls: ['./job-search-profiles-widget.component.scss'],
  animations: [removeSearchProfileAnimation]
})
export class JobSearchProfilesWidgetComponent implements OnInit {

  IconKey = IconKey;

  jobSearchProfiles: JobAdSearchProfileResult[] = [];

  private readonly MAX_DISPLAY_ITEMS = 5;

  constructor(private jobAdSearchProfilesRepository: JobAdSearchProfilesRepository,
              private modalService: ModalService,
              private notificationsService: NotificationsService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.initItems();
  }

  initItems() {
    this.authenticationService.getCurrentUser().pipe(
      take(1),
      flatMap(user => this.jobAdSearchProfilesRepository.search(user.id))
    ).subscribe(response => {
      // Pushing new items to the array is needed in order to make the animation work
      response.result.slice(this.jobSearchProfiles.length, this.MAX_DISPLAY_ITEMS).forEach(result => {
        this.jobSearchProfiles.push(result);
      });
    });
  }

  onDeleteProfile(profile: SearchProfile) {
    this.modalService.openConfirm(
      getJobAdDeleteConfirmModalConfig(profile.name)
    ).result
      .then(result => {
        this.jobAdSearchProfilesRepository.delete(profile.id)
          .subscribe(() => {
            this.notificationsService.success('portal.job-ad-search-profiles.notification.profile-deleted');
            this.jobSearchProfiles.splice(this.jobSearchProfiles.findIndex(p => p.id === profile.id), 1);
            this.initItems();
          });
      })
      .catch(() => {
      });
  }

}
