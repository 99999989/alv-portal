import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import { Softskill } from '../../../shared/backend-services/competence-catalog/softskill/softskill.types';
import { Observable, of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SoftskillRepository } from '../../../shared/backend-services/competence-catalog/softskill/softskill-repository.service';
import { NotificationsService } from '../../../core/notifications.service';
import { getModalTitle } from '../utils/translation-utils';
import { draftRadioButtonOptions, publishedRadioButtonOptions } from '../constants';
import { CompetenceCatalogEditorAwareComponent } from '../competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { catchError } from 'rxjs/operators';
import { BusinessExceptionsHandlerService } from '../business-exceptions-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkflowFormValue } from '../shared-competence-catalog.types';

@Component({
  selector: 'alv-softskill-modal',
  templateUrl: './softskill-modal.component.html',
  styleUrls: ['./softskill-modal.component.scss']
})
export class SoftskillModalComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  @Input() softskill: Softskill;

  @Input() isReadonly = false;

  form: FormGroup;

  createAnotherFormControl: FormControl;

  workflowFormValue: WorkflowFormValue;

  modalTitle: string;

  isEdit = false;

  publishedRadioButtonOptions$ = of(publishedRadioButtonOptions);

  draftRadioButtonOptions$ = of(draftRadioButtonOptions);

  constructor(private fb: FormBuilder,
              private softskillRepository: SoftskillRepository,
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
    if (this.softskill) {
      this.form.patchValue(this.softskill);
      this.isEdit = true;
    }
    this.modalTitle = getModalTitle(this.isReadonly, this.isEdit);
    this.workflowFormValue = {
      published: this.softskill.published,
      draft: this.softskill.draft
    };
  }

  submit() {
    if (this.isEdit) {
      this.updateSoftskill();
    } else {
      this.createSoftskill();
    }
  }


  cancel() {
    this.modal.dismiss();
  }

  private updateSoftskill() {
    this.softskillRepository.update(this.softskill.id, {
      description: this.form.get('description').value,
      draft: this.form.get('draft').value,
      published: this.form.get('published').value
    })
      .pipe(catchError(this.handleFailure.bind(this)))

      .subscribe(this.handleSuccess.bind(this));
  }

  private createSoftskill() {
    this.softskillRepository.create(this.form.value)
      .pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result) {
    this.notificationsService.success('portal.competence-catalog.softskills.add-modal.added-success-notification');
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

