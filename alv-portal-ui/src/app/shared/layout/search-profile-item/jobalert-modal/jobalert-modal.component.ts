import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Observable,
  of
} from 'rxjs';
import { AbstractSubscriber } from '../../../../core/abstract-subscriber';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { ModalService } from '../../modal/modal.service';
import { I18nService } from '../../../../core/i18n.service';
import {
  take,
  takeUntil
} from 'rxjs/operators';
import { JobAdSearchProfilesRepository } from '../../../backend-services/job-ad-search-profiles/job-ad-search-profiles.repository';
import { NotificationType } from '../../notifications/notification.model';
import {
  Interval,
  JobAdSearchProfileResult,
  JobAlertDto
} from '../../../backend-services/job-ad-search-profiles/job-ad-search-profiles.types';
import { NotificationsService } from '../../../../core/notifications.service';
import { User } from '../../../../core/auth/user.model';

export interface JobAlertFormValue {
  email: string;
  currentLanguage: string;
  interval: Interval;
}

@Component({
  selector: 'alv-jobalert-modal',
  templateUrl: './jobalert-modal.component.html'
})
export class JobAlertModalComponent extends AbstractSubscriber implements OnInit {

  form: FormGroup;

  @Input() searchProfile: JobAdSearchProfileResult;

  jobAlertDto: JobAlertDto;

  private currentLang: string;

  isJobAlertEnabled: boolean;

  currentUser$: Observable<User>;

  infoNotification = {
    type: NotificationType.INFO,
    isSticky: true
  };

  jobAlertOptions$ = of([
    {
      label: 'portal.job-ad-search-profiles.job-alert.modal.interval-one-day',
      value: Interval.INT_1DAY
    },
    {
      label: 'portal.job-ad-search-profiles.job-alert.modal.interval-three-days',
      value: Interval.INT_3DAY
    },
    {
      label: 'portal.job-ad-search-profiles.job-alert.modal.interval-five-days',
      value: Interval.INT_5DAY
    }]);

  constructor(public activeModal: NgbActiveModal,
              private authenticationService: AuthenticationService,
              private modalService: ModalService,
              private fb: FormBuilder,
              private jobAdSearchProfilesRepository: JobAdSearchProfilesRepository,
              private notificationsService: NotificationsService,
              private i18nService: I18nService) {
    super();
    this.form = this.fb.group({
      email: [null, Validators.requiredTrue],
      interval: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.isJobAlertEnabled = !!this.searchProfile.jobAlertDto.email;
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
    this.currentUser$ = this.authenticationService.getCurrentUser();

    this.currentUser$.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        if (!!user) {
          this.form = this.fb.group({
            email: ['', Validators.required],
            interval: [this.searchProfile.jobAlertDto.interval || null, Validators.required]
          });
          this.patchTemplateValues(user.email);
        }
      });
  }

  onEnable(form: FormGroup) {
    const formValue = <JobAlertFormValue>form.value;
    this.isJobAlertEnabled = true;
    this.jobAlertDto = {
      email: formValue.email,
      contactLanguageIsoCode: this.currentLang,
      interval: formValue.interval
    };
    this.activeModal.close({
      searchProfile: this.searchProfile,
      jobAlertDto: this.jobAlertDto
    });
  }

  onDisable() {
    this.isJobAlertEnabled = false;
    this.activeModal.close({
      searchProfileId: this.searchProfile.id,
    });
  }

  onRelease() {
    this.jobAdSearchProfilesRepository
      .releaseJobAlert(this.searchProfile.id).subscribe(() => {
      this.notificationsService.success('RELEASED');
      this.activeModal.close();
    });
  }


  onCancel() {
    this.activeModal.dismiss();
    return;
  }

  private patchTemplateValues(email: string): void {
    this.form.patchValue({
      email: email
    });
  }

}
