import { Component, Input, OnInit } from '@angular/core';
import { LegalTerms } from '../../../shared/backend-services/legal-terms-management/legal-terms-management.types';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { URL_REGEX } from '../../../shared/forms/regex-patterns';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LegalTermsManagementRepository } from '../../../shared/backend-services/legal-terms-management/legal-terms-management-repository';
import { patternInputValidator } from '../../../shared/forms/input/input-field/pattern-input.validator';
import {
  LEGAL_ACTIONS,
  LEGAL_TERMS_LINKS,
  mapToDateTime,
  todayDateTime
} from '../legal-terms-management.types';
import { fromISODate, toISOLocalDate, tomorrow } from '../../../shared/forms/input/ngb-date-utils';

@Component({
  selector: 'alv-legal-terms-detail-modal',
  templateUrl: './legal-terms-detail-modal.component.html',
  styleUrls: ['./legal-terms-detail-modal.component.scss']
})
export class LegalTermsDetailModalComponent implements OnInit {

  readonly LEGAL_TERMS_LINKS = LEGAL_TERMS_LINKS;

  @Input()
  legalTerm: LegalTerms;

  @Input()
  actionTyp: LEGAL_ACTIONS;

  @Input()
  readonly: boolean;

  form: FormGroup;

  minEffectiveAt = tomorrow();

  constructor(private fb: FormBuilder,
              private legalTermsManagementRepository: LegalTermsManagementRepository,
              public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.prepareForm();
  }

  onSubmit() {
    switch (this.actionTyp) {
      case LEGAL_ACTIONS.NEW:
        this.legalTermsManagementRepository.addLegalTermsEntry(this.mapToLegalTerms(this.form.value))
          .subscribe( () => this.activeModal.close());
        break;
      case LEGAL_ACTIONS.EDIT:
        this.legalTermsManagementRepository.updateLegalTermsEntry(this.mapToLegalTerms(this.form.value))
          .subscribe( () => this.activeModal.close());
        break;
      case LEGAL_ACTIONS.VIEW:
        this.activeModal.close();
        break;
    }
  }

  onDismiss() {
    this.activeModal.dismiss();
  }

  private mapToLegalTerms(value: any): LegalTerms {
    return {
      id: (this.legalTerm == null) ? null : this.legalTerm.id,
      effectiveAt: toISOLocalDate(value.effectiveAt),
      termsOfUsageLinkDe: value.termsOfUsageLinkDe,
      termsOfUsageLinkEn: value.termsOfUsageLinkEn,
      termsOfUsageLinkFr: value.termsOfUsageLinkFr,
      termsOfUsageLinkIt: value.termsOfUsageLinkIt,
      privacyStatementLinkDe: value.privacyStatementLinkDe,
      privacyStatementLinkEn: value.privacyStatementLinkEn,
      privacyStatementLinkFr: value.privacyStatementLinkFr,
      privacyStatementLinkIt: value.privacyStatementLinkIt
    };
  }

  private prepareForm() {

    const effectiveAtValidator: ValidatorFn = (formGroup: FormGroup) => {
      const effectiveAt = formGroup.get('effectiveAt').value;
      return effectiveAt != null && mapToDateTime(effectiveAt) > todayDateTime() ? null : { pastEffectiveAt: true };
    };
    this.form = this.fb.group({
      effectiveAt: [null, [Validators.required]],
      termsOfUsageLinkDe: ['', [Validators.required, patternInputValidator(URL_REGEX)]],
      termsOfUsageLinkEn: ['', [Validators.required, patternInputValidator(URL_REGEX)]],
      termsOfUsageLinkFr: ['', [Validators.required, patternInputValidator(URL_REGEX)]],
      termsOfUsageLinkIt: ['', [Validators.required, patternInputValidator(URL_REGEX)]],
      privacyStatementLinkDe: ['', [Validators.required, patternInputValidator(URL_REGEX)]],
      privacyStatementLinkEn: ['', [Validators.required, patternInputValidator(URL_REGEX)]],
      privacyStatementLinkFr: ['', [Validators.required, patternInputValidator(URL_REGEX)]],
      privacyStatementLinkIt: ['', [Validators.required, patternInputValidator(URL_REGEX)]]
    }, {
      validator: [effectiveAtValidator]
    });

    if (this.legalTerm) {
      this.patchFormValues();
    }
  }

  private patchFormValues() {
    this.form.patchValue({
      effectiveAt: (this.readonly) ? this.legalTerm.effectiveAt : fromISODate(this.legalTerm.effectiveAt),
      termsOfUsageLinkDe: this.legalTerm.termsOfUsageLinkDe,
      termsOfUsageLinkEn: this.legalTerm.termsOfUsageLinkEn,
      termsOfUsageLinkFr: this.legalTerm.termsOfUsageLinkFr,
      termsOfUsageLinkIt: this.legalTerm.termsOfUsageLinkIt,
      privacyStatementLinkDe: this.legalTerm.privacyStatementLinkDe,
      privacyStatementLinkEn: this.legalTerm.privacyStatementLinkEn,
      privacyStatementLinkFr: this.legalTerm.privacyStatementLinkFr,
      privacyStatementLinkIt: this.legalTerm.privacyStatementLinkIt
    });
  }

}
