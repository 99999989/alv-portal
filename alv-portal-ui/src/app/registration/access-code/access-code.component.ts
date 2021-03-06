import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/auth/authentication.service';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { AbstractSubscriber } from '../../core/abstract-subscriber';
import { RegistrationStatus } from '../../core/auth/user.model';
import { StepIndicatorItem } from '../../shared/layout/step-indicator/step.model';
import { NotificationsService } from '../../core/notifications.service';
import { pavSteps } from '../finish-registration/pav/pav-steps.config';
import { companySteps } from '../finish-registration/company/company-steps.config';
import { EMPTY } from 'rxjs';
import { RegistrationRepository } from '../../shared/backend-services/registration/registration.repository';

@Component({
  selector: 'alv-access-code',
  templateUrl: './access-code.component.html',
  styleUrls: ['./access-code.component.scss']
})
export class AccessCodeComponent extends AbstractSubscriber implements OnInit {

  readonly ACCESS_CODE_LENGTH = 8;

  accessCodeForm: FormGroup;

  steps: StepIndicatorItem[];

  constructor(private fb: FormBuilder,
              private registrationRepository: RegistrationRepository,
              private router: Router,
              private notificationsService: NotificationsService,
              private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    this.accessCodeForm = this.fb.group({
      accessCode: ['', [Validators.required, Validators.minLength(this.ACCESS_CODE_LENGTH), Validators.maxLength(this.ACCESS_CODE_LENGTH)]]
    });

    this.prepareStepIndicator();
  }

  submitAccessCode() {
    this.registrationRepository.registerEmployerOrAgent(this.accessCodeForm.get('accessCode').value).pipe(
      switchMap((response) => {
        if (response.success) {
          return this.authenticationService.reloadCurrentUser().pipe(
            tap(() => {
              this.router.navigate(['/dashboard']);
            }));
        } else {
          this.notificationsService.error('registrationAccessCode.accessCode.error.invalid');
          this.accessCodeForm.reset();
          return EMPTY;
        }
      })
    ).subscribe();
  }

  returnToHome() {
    this.router.navigate(['home']);
  }

  private prepareStepIndicator() {
    this.authenticationService.getCurrentUser()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(user => {
        if (user && user.registrationStatus === RegistrationStatus.VALIDATION_PAV) {
          this.steps = pavSteps;
        } else if (user && user.registrationStatus === RegistrationStatus.VALIDATION_EMP) {
          this.steps = companySteps;
        } else {
          this.router.navigate(['home']);
        }
      });
  }
}
