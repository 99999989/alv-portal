import { Component, Input, OnInit } from '@angular/core';
import { AbstractSubscriber } from '../../../../../core/abstract-subscriber';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProofOfWorkEffortsRepository } from '../../../../../shared/backend-services/work-efforts/proof-of-work-efforts.repository';
import { ModalService } from '../../../../../shared/layout/modal/modal.service';
import { AuthenticationService } from '../../../../../core/auth/authentication.service';
import { NotificationsService } from '../../../../../core/notifications.service';
import { NotificationType } from '../../../../../shared/layout/notifications/notification.model';

@Component({
  selector: 'alv-proof-of-work-efforts-submit-modal',
  templateUrl: './proof-of-work-efforts-submit-modal.component.html',
  styleUrls: ['./proof-of-work-efforts-submit-modal.component.scss']
})
export class ProofOfWorkEffortsSubmitModalComponent extends AbstractSubscriber implements OnInit {

  @Input() proofOfWorkEffortsId: string;

  loadingSubscription: Subscription;

  warning = {
    type: NotificationType.WARNING,
    isSticky: true
  }

  constructor(public activeModal: NgbActiveModal,
              private proofOfWorkEffortsRepository: ProofOfWorkEffortsRepository,
              private modalService: ModalService,
              private authenticationService: AuthenticationService,
              private notificationsService: NotificationsService) {
    super();
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loadingSubscription = this.proofOfWorkEffortsRepository.submitProofOfWorkEfforts(this.proofOfWorkEffortsId)
      .subscribe(() => {
        this.activeModal.close();
        this.notificationsService.success('portal.job-ad-favourites.notification.favourite-note-saved');
      }, () => {
        this.activeModal.close();
        this.notificationsService.error('portal.job-ad-favourites.notification.favourite-note-saved');
      });
  }

  onCancel() {
    this.activeModal.dismiss();
  }

}
