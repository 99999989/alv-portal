import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LegalTermsService } from '../legal-terms.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { LoginService } from '../../auth/login.service';
import { NotificationType } from '../../layout/notifications/notification.model';

@Component({
  selector: 'alv-legal-terms-modal',
  templateUrl: './legal-terms-modal.component.html',
  styleUrls: ['./legal-terms-modal.component.scss']
})
export class LegalTermsModalComponent {

  infoNotification = {
    type: NotificationType.INFO,
    isSticky: true
  };

  form: FormGroup;

  legalTermsUrl$: Observable<string>;

  constructor(private activeModal: NgbActiveModal,
              private legalTermsService: LegalTermsService,
              private authenticationService: AuthenticationService,
              private loginSerivce: LoginService,
              private fb: FormBuilder) {

    this.legalTermsUrl$ = this.legalTermsService.getLegalTermsUrl();

    this.form = this.fb.group({
      termsAndConditions: [false, Validators.requiredTrue]
    });
  }

  acceptLegalTerms() {
    this.legalTermsService.acceptLegalTerms()
      .subscribe(() => this.authenticationService.reloadCurrentUser());
  }

  rejectLegalTerms() {
    this.loginSerivce.logout();
  }
}
