import { Component, Input, OnInit } from '@angular/core';
import { CandidateProfile, EmailContactModal } from '../../../shared/backend-services/candidate/candidate.types';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { I18nService } from '../../../core/i18n.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, takeUntil, withLatestFrom } from 'rxjs/operators';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { EMAIL_REGEX, HOUSE_NUMBER_REGEX } from '../../../shared/forms/regex-patterns';
import { CompanyContactTemplateModel } from '../../../core/auth/company-contact-template-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { phoneInputValidator } from '../../../shared/forms/input/input-field/phone-input.validator';
import { combineLatest } from 'rxjs';
import { CandidateContactRepository } from '../../../shared/backend-services/candidate/candidate-contact-repository';
import { patternInputValidator } from '../../../shared/forms/input/input-field/pattern-input.validator';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/checkbox/at-least-one-required.validator';

@Component({
  selector: 'alv-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent extends AbstractSubscriber implements OnInit {

  readonly TITLE_MAX_LENGTH = 150;

  readonly MESSAGE_MAX_LENGTH = 1000;

  readonly LABEL_VALUES: string[] = [
    'candidate-detail.candidate-anonymous-contact.subject',
    'candidate-detail.anonymous-contact.personal-message',
    'global.reference.canton.CH',
    'candidate-detail.anonymous-contact.mail-body-preamble'
  ];

  @Input()
  candidate: CandidateProfile;

  form: FormGroup;

  mailBodyPreamble: string;

  private countryValue: string;

  constructor(private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              private fb: FormBuilder,
              private candidateContactRepository: CandidateContactRepository,
              public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit() {

    this.form = this.prepareForm();

    combineLatest(this.authenticationService.getCurrentCompany(), this.i18nService.stream(this.LABEL_VALUES)).pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(([company, translate]) => {
        this.countryValue = translate[this.LABEL_VALUES[2]];
        this.mailBodyPreamble = translate[this.LABEL_VALUES[3]];
        this.patchAllFormValues(company, translate);
      });

    this.form.get('postCheckbox').valueChanges.pipe(
      distinctUntilChanged(),
      withLatestFrom(this.authenticationService.getCurrentCompany()),
      takeUntil(this.ngUnsubscribe))
      .subscribe(([postCheckBoxEnabled, company]) => {
        if (postCheckBoxEnabled) {
          this.form.addControl('company', this.generateCompanyFormGroup());
          this.patchCompanyValues(company);
        } else {
          this.form.removeControl('company');
        }
      });

    this.form.get('phoneCheckbox').valueChanges.pipe(
      distinctUntilChanged(),
      withLatestFrom(this.authenticationService.getCurrentCompany()),
      takeUntil(this.ngUnsubscribe))
      .subscribe(([phoneCheckBoxEnabled, company]) => {
        if (phoneCheckBoxEnabled) {
          this.form.get('phone').setValidators([Validators.required, phoneInputValidator()]);
          this.patchPhoneValue(company.phone);
        } else {
          this.form.get('phone').clearValidators();
          this.patchPhoneValue(null);
        }
      });

    this.form.get('emailCheckbox').valueChanges.pipe(
      distinctUntilChanged(),
      withLatestFrom(this.authenticationService.getCurrentCompany()),
      takeUntil(this.ngUnsubscribe))
      .subscribe(([emailCheckBoxEnabled, company]) => {
        if (emailCheckBoxEnabled) {
          this.form.get('email').setValidators([Validators.required, patternInputValidator(EMAIL_REGEX)]);
          this.patchEmailValue(company.email);
        } else {
          this.form.get('email').clearValidators();
          this.patchEmailValue(null);
        }
      });

  }

  onSubmit() {
    this.candidateContactRepository.sendContactModalEmail(this.mapEmailContent(this.form.value))
      .subscribe(() => this.activeModal.close());
  }

  private prepareForm(): FormGroup {
    return this.fb.group({
      subject: [null, Validators.required],
      company: this.generateCompanyFormGroup(),
      personalMessage: [null, Validators.required],
      companyName: [null, Validators.required],
      phoneCheckbox: [true],
      phone: [null],
      emailCheckbox: [true],
      email: [null],
      postCheckbox: [true]
    }, {
      validator: [atLeastOneRequiredValidator(['phoneCheckbox', 'emailCheckbox', 'postCheckbox'])]
    });
  }

  private generateCompanyFormGroup() {
    return this.fb.group({
      contactPerson: [null, Validators.required],
      companyName: [null, Validators.required],
      companyStreet: [null, Validators.required],
      companyHouseNr: [null, [Validators.required, patternInputValidator(HOUSE_NUMBER_REGEX)]],
      companyZipCode: [null, Validators.required],
      companyCity: [null, Validators.required],
      companyCountry: [null, Validators.required]
    });
  }

  private patchAllFormValues(company: CompanyContactTemplateModel, translate: Object): void {

    this.form.patchValue({
      subject: translate[this.LABEL_VALUES[0]],
      personalMessage: translate[this.LABEL_VALUES[1]],
      companyName: company.companyName,
      phone: company.phone,
      email: company.email
    });

    if (this.form.controls.company) {
      this.patchCompanyValues(company);
    }
  }

  private patchCompanyValues(company: CompanyContactTemplateModel) {
    const companyForm = this.form.controls.company;
    companyForm.patchValue({
      contactPerson: company.displayName,
      companyName: company.companyName,
      companyStreet: company.companyStreet,
      companyHouseNr: company.companyHouseNr,
      companyZipCode: company.companyZipCode,
      companyCity: company.companyCity,
      companyCountry: this.countryValue
    });
  }

  private patchPhoneValue(phone: string) {
    this.form.patchValue({
      phone: phone
    });
  }

  private patchEmailValue(email: string) {
    this.form.patchValue({
      email: email
    });
  }

  private mapEmailContent(formValue: any): EmailContactModal {
    return {
      candidateId: this.candidate.id,
      company: formValue.company,
      companyName: formValue.companyName,
      email: formValue.email,
      phone: formValue.phone,
      personalMessage: formValue.personalMessage,
      subject: formValue.subject
    };
  }

}
