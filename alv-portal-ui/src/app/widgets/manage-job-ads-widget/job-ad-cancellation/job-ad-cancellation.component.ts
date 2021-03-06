import { Component, Input, OnInit } from '@angular/core';
import {
  CancellationReason,
  JobAdvertisement
} from '../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobAdvertisementRepository } from '../../../shared/backend-services/job-advertisement/job-advertisement.repository';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { switchMap } from 'rxjs/operators';
import { NotificationsService } from '../../../core/notifications.service';

@Component({
  selector: 'alv-job-ad-cancelation-dialog',
  templateUrl: './job-ad-cancellation.component.html',
  styleUrls: ['./job-ad-cancellation.component.scss']
})
export class JobAdCancellationComponent extends AbstractSubscriber implements OnInit {

  @Input()
  jobAdvertisement: JobAdvertisement;

  @Input()
  accessToken: string;

  form: FormGroup;

  cancellationCodeOptionsA$ = of([
    {
      label: 'job-publication-cancel.job.occupied.jobCenter',
      value: CancellationReason.OCCUPIED_JOBCENTER
    },
    {
      label: 'job-publication-cancel.job.occupied.privateAgency',
      value: CancellationReason.OCCUPIED_AGENCY
    }
  ]);

  cancellationCodeOptionsB$ = of([
    {
      label: 'job-publication-cancel.job.occupied.jobroom',
      value: CancellationReason.OCCUPIED_JOBROOM
    },
    {
      label: 'job-publication-cancel.job.occupied.not-jobroom',
      value: CancellationReason.OCCUPIED_OTHER
    }
  ]);

  cancellationCodeOptionsC$ = of([
    {
      label: 'job-publication-cancel.job.change-or-repost',
      value: CancellationReason.CHANGE_OR_REPOSE
    },
    {
      label: 'job-publication-cancel.job.not-occupied',
      value: CancellationReason.NOT_OCCUPIED
    }
  ]);

  constructor(public activeModal: NgbActiveModal,
              private fb: FormBuilder,
              private jobAdvertisementRepository: JobAdvertisementRepository,
              private notificationsService: NotificationsService) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({ positionOccupied: ['', Validators.required] });
  }

  onSubmit() {
    this.jobAdvertisementRepository.cancel({
      code: this.form.value.positionOccupied,
      id: this.jobAdvertisement.id,
      token: this.accessToken
    }).pipe(
      switchMap(() => this.jobAdvertisementRepository.findById(this.jobAdvertisement.id))
    ).subscribe((jobAdvertisement) => {
      this.notificationsService.success('portal.manage-job-ads.cancel.success');
      this.activeModal.close(jobAdvertisement);
    });
  }

}
