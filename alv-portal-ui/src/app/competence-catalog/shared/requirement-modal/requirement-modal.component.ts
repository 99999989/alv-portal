import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import { Requirement, } from '../../../shared/backend-services/competence-catalog/requirement/requirement.types';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequirementRepository } from '../../../shared/backend-services/competence-catalog/requirement/requirement.repository';
import { NotificationsService } from '../../../core/notifications.service';
import { getModalTitle } from '../utils/translation-utils';
import { draftRadioButtonOptions, publishedRadioButtonOptions } from '../constants';
import { CompetenceCatalogEditorAwareComponent } from '../competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';

@Component({
  selector: 'alv-requirement-modal',
  templateUrl: './requirement-modal.component.html',
  styleUrls: ['./requirement-modal.component.scss']
})
export class RequirementModalComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  @Input() requirement: Requirement;

  @Input() isReadonly = false;

  form: FormGroup;

  createAnotherFormControl: FormControl;

  modalTitle: string;

  isEdit = false;

  publishedRadioButtonOptions$ = of(publishedRadioButtonOptions);

  draftRadioButtonOptions$ = of(draftRadioButtonOptions);

  constructor(private fb: FormBuilder,
              private requirementRepository: RequirementRepository,
              private notificationsService: NotificationsService,
              private modal: NgbActiveModal,
              protected authenticationService: AuthenticationService) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.createAnotherFormControl = this.fb.control(false);
    this.form = this.fb.group({
      published: [false, Validators.required],
      draft: [true, Validators.required],
      description: this.fb.group({
        de: [''],
        fr: [''],
        it: [''],
        en: ['']
      }, {
        validators: [atLeastOneRequiredValidator(['de', 'fr', 'it', 'en'])]
      })
    });
    if (this.requirement) {
      this.form.patchValue(this.requirement);
      this.isEdit = true;
    }
    this.modalTitle = getModalTitle(this.isReadonly, this.isEdit);
  }

  submit() {
    if (this.isEdit) {
      this.updateRequirement();
    } else {
      this.createRequirement();
    }
  }


  cancel() {
    this.modal.dismiss();
  }

  private updateRequirement() {
    this.requirementRepository.update(this.requirement.id, {
      description: this.form.get('description').value,
      draft: this.form.get('draft').value,
      published: this.form.get('published').value
    })
      .subscribe(this.handleSuccess.bind(this));
  }

  private createRequirement() {
    this.requirementRepository.create(this.form.value)
      .subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result) {
    this.notificationsService.success('portal.competence-catalog.requirements.add-modal.added-success-notification');
    if (this.createAnotherFormControl.value === true) {
      this.form.reset({
        description: {
          de: '',
          fr: '',
          it: '',
          en: ''
        },
        published: false,
        draft: true
      });
    } else {
      this.modal.close(result);
    }
  }

}
