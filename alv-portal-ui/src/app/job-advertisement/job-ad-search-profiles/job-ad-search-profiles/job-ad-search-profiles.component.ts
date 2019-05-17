import { Component, OnInit } from '@angular/core';
import { IconKey } from '../../../shared/icons/custom-icon/custom-icon.component';
import { JobAdSearchProfilesRepository } from '../../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { flatMap, map, take } from 'rxjs/operators';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { NotificationsService } from '../../../core/notifications.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { JobAdSearchProfileResult } from '../../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.types';
import { getDeleteConfirmModalConfig } from '../../../shared/job-search-profiles/modal-config.types';

@Component({
  selector: 'alv-job-ad-search-profiles',
  templateUrl: './job-ad-search-profiles.component.html',
  styleUrls: ['./job-ad-search-profiles.component.scss'],
  animations: [
    trigger('removeProfile', [
      transition(':leave', [
        animate('0.5s ease-in', keyframes([
          style({
            transformOrigin: 'top',
            transform: 'scaleY(1)',
            opacity: 1,
            maxHeight: '50px'
          }),
          style({
            transform: 'scaleY(0)',
            opacity: 0,
            maxHeight: 0
          })
        ]))
      ])
    ]),
  ]
})
export class JobAdSearchProfilesComponent implements OnInit {

  IconKey = IconKey;

  jobSearchProfiles: JobAdSearchProfileResult[] = [];

  private page = 0;

  private readonly size = 100;

  constructor(private jobAdSearchProfilesRepository: JobAdSearchProfilesRepository,
              private authenticationService: AuthenticationService,
              private modalService: ModalService,
              private notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.onScroll();
  }

  onScroll() {
    this.authenticationService.getCurrentUser().pipe(
      take(1),
      flatMap(user => this.jobAdSearchProfilesRepository.search(user.id, this.page++, this.size)),
      map(response => response.result)
    ).subscribe(profiles => {
      this.jobSearchProfiles = [...this.jobSearchProfiles, ...profiles];
    });
  }

  onDeleteProfile(profile: JobAdSearchProfileResult) {
    this.modalService.openConfirm(
      getDeleteConfirmModalConfig(profile.name)
    ).result
      .then(result => {
        this.jobAdSearchProfilesRepository.delete(profile.id)
          .subscribe(() => {
            this.notificationsService.success('portal.job-ad-search-profiles.notification.profile-deleted');
            this.jobSearchProfiles.splice(this.jobSearchProfiles.findIndex(searchProfile => searchProfile.id === profile.id), 1);
          });
      })
      .catch(() => {
      });
  }
}
