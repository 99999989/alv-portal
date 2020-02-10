import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import { Prerequisite } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite.types';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PrerequisiteRepository } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite-repository.service';
import { NotificationsService } from '../../../core/notifications.service';
import { getModalTitle } from '../utils/translation-utils';
import { defaultWorkflowValue } from '../constants';
import { CompetenceCatalogEditorAwareComponent } from '../competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { catchError } from 'rxjs/operators';
import { BusinessExceptionsHandlerService } from '../business-exceptions-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkflowFormValue } from '../shared-competence-catalog.types';

@Component({
  selector: 'alv-prerequisite-modal',
  templateUrl: './prerequisite-modal.component.html',
  styleUrls: ['./prerequisite-modal.component.scss']
})
export class PrerequisiteModalComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  @Input() prerequisite: Prerequisite;

  @Input() isReadonly = false;

  form: FormGroup;

  workflowFormValue: WorkflowFormValue = defaultWorkflowValue;

  createAnotherFormControl: FormControl;

  modalTitle: string;

  isEdit = false;

  constructor(private fb: FormBuilder,
              private prerequisiteRepository: PrerequisiteRepository,
              private notificationsService: NotificationsService,
              private modal: NgbActiveModal,
              protected authenticationService: AuthenticationService,
              private businessExceptionsHandlerService: BusinessExceptionsHandlerService) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.createAnotherFormControl = this.fb.control(false);
    this.form = this.fb.group({
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
      this.workflowFormValue = {
        published: this.prerequisite.published,
        draft: this.prerequisite.draft
      };
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

  private handleFailure(error: HttpErrorResponse): Observable<never> {
    return this.businessExceptionsHandlerService.handleError(error);
  }
}

