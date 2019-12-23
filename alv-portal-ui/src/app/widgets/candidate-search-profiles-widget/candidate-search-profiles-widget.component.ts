import { Component, OnInit } from '@angular/core';
import { IconKey } from '../../shared/icons/custom-icon/custom-icon.component';
import { CandidateSearchProfileResult } from '../../shared/backend-services/candidate-search-profiles/candidate-search-profiles.types';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { NotificationsService } from '../../core/notifications.service';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { CandidateSearchProfilesRepository } from '../../shared/backend-services/candidate-search-profiles/candidate-search-profiles.repository';
import { flatMap, take } from 'rxjs/operators';
import { SearchProfile } from '../../shared/backend-services/shared.types';
import { getCandidateDeleteConfirmModalConfig } from '../../shared/search-profiles/modal-config.types';
import { removeSearchProfileAnimation } from '../../shared/animations/animations';

@Component({
  selector: 'alv-candidate-search-profiles-widget',
  templateUrl: './candidate-search-profiles-widget.component.html',
  styleUrls: ['./candidate-search-profiles-widget.component.scss'],
  animations: [removeSearchProfileAnimation]
})
export class CandidateSearchProfilesWidgetComponent implements OnInit {

  IconKey = IconKey;

  candidateSearchProfiles: CandidateSearchProfileResult[] = [];

  private readonly MAX_DISPLAY_ITEMS = 5;

  constructor(private candidateSearchProfilesRepository: CandidateSearchProfilesRepository,
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
      flatMap(user => this.candidateSearchProfilesRepository.search(user.id)),
    ).subscribe(response => {
      // Pushing new items to the array is needed in order to make the animation work
      response.result.slice(this.candidateSearchProfiles.length, this.MAX_DISPLAY_ITEMS).forEach(result => {
        this.candidateSearchProfiles.push(result);
      });
    });
  }

  onDeleteProfile(profile: SearchProfile) {
    this.modalService.openConfirm(
      getCandidateDeleteConfirmModalConfig(profile.name)
    ).result
      .then(result => {
        this.candidateSearchProfilesRepository.delete(profile.id)
          .subscribe(() => {
            this.notificationsService.success('portal.candidate-search-profiles.notification.profile-deleted');
            this.candidateSearchProfiles.splice(this.candidateSearchProfiles.findIndex(p => p.id === profile.id), 1);
            this.initItems();
          });
      })
      .catch(() => {
      });
  }
}
