import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import { Prerequisite } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite.types';
import { EMPTY, of, throwError } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrerequisiteRepository } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite-repository.service';
import { NotificationsService } from '../../../core/notifications.service';
import { getModalTitle } from '../utils/translation-utils';
import { draftRadioButtonOptions, publishedRadioButtonOptions } from '../constants';
import { CompetenceCatalogEditorAwareComponent } from '../competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { BusinessExceptionTypes } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'alv-prerequisite-modal',
  templateUrl: './prerequisite-modal.component.html',
  styleUrls: ['./prerequisite-modal.component.scss']
})
export class PrerequisiteModalComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  @Input() prerequisite: Prerequisite;

  @Input() isReadonly = false;

  form: FormGroup;

  createAnotherFormControl: FormControl;

  modalTitle: string;

  isEdit = false;

  publishedRadioButtonOptions$ = of(publishedRadioButtonOptions);

  draftRadioButtonOptions$ = of(draftRadioButtonOptions);

  constructor(private fb: FormBuilder,
              private prerequisiteRepository: PrerequisiteRepository,
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
    if (this.prerequisite) {
      this.form.patchValue(this.prerequisite);
      this.isEdit = true;
    }
    this.modalTitle = getModalTitle(this.isReadonly, this.isEdit);
  }

  submit() {
    if (this.isEdit) {
      this.updatePrerequisite();
    } else {
      this.createPrerequisite();
    }
  }


  cancel() {
    this.modal.dismiss();
  }

  private updatePrerequisite() {
    this.prerequisiteRepository.update(this.prerequisite.id, {
      description: this.form.get('description').value,
      draft: this.form.get('draft').value,
      published: this.form.get('published').value
    })
      .pipe(catchError(this.handleFailure.bind(this)))

      .subscribe(this.handleSuccess.bind(this));
  }

  private createPrerequisite() {
    this.prerequisiteRepository.create(this.form.value)
      .pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result) {
    this.notificationsService.success('portal.competence-catalog.prerequisites.add-modal.added-success-notification');
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

  private handleFailure(error) {
    if (error.error['business-exception-type'] === BusinessExceptionTypes.CANNOT_PUBLISH_DRAFT) {
      this.notificationsService.error('portal.competence-catalog.error-message.cannot_publish_draft');
      return EMPTY;
    }
    return throwError;
  }

}
