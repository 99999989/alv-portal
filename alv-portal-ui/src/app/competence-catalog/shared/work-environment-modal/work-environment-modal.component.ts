import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import {
  WorkEnvironment,
  WorkEnvironmentType
} from '../../../shared/backend-services/competence-catalog/work-environment/work-environment.types';
import { Observable, of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WorkEnvironmentRepository } from '../../../shared/backend-services/competence-catalog/work-environment/work-environment-repository.service';
import { NotificationsService } from '../../../core/notifications.service';
import { getModalTitle } from '../utils/translation-utils';
import { draftRadioButtonOptions, publishedRadioButtonOptions } from '../constants';
import { CompetenceCatalogEditorAwareComponent } from '../competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { SelectableOption } from '../../../shared/forms/input/selectable-option.model';
import { catchError } from 'rxjs/operators';
import { BusinessExceptionsHandlerService } from '../business-exceptions-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkflowFormValue } from '../shared-competence-catalog.types';

@Component({
  selector: 'alv-work-environment-modal',
  templateUrl: './work-environment-modal.component.html',
  styleUrls: ['./work-environment-modal.component.scss']
})
export class WorkEnvironmentModalComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  @Input() workEnvironment: WorkEnvironment;

  @Input() isReadonly = false;

  form: FormGroup;

  createAnotherFormControl: FormControl;

  workflowFormValue: WorkflowFormValue;

  modalTitle: string;

  isEdit = false;

  typeOptions$: Observable<SelectableOption[]> = of([{
      value: null,
      label: 'portal.competence-catalog.work-environments.add-modal.choose-type'
    }
    ].concat(Object.values(WorkEnvironmentType).map(type => {
      return {
        label: 'portal.competence-catalog.work-environment-type.' + type,
        value: type
      };
    }))
  );

  publishedRadioButtonOptions$ = of(publishedRadioButtonOptions);

  draftRadioButtonOptions$ = of(draftRadioButtonOptions);

  constructor(private fb: FormBuilder,
              private workEnvironmentRepository: WorkEnvironmentRepository,
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
      type: [null, Validators.required],
      description: this.fb.group({
        de: [''],
        fr: [''],
        it: [''],
        en: ['']
      }, {
        validators: [atLeastOneRequiredValidator(['de', 'fr', 'it', 'en'])]
      })
    });
    if (this.workEnvironment) {
      this.form.patchValue(this.workEnvironment);
      this.isEdit = true;
    }
    this.modalTitle = getModalTitle(this.isReadonly, this.isEdit);
    this.workflowFormValue = {
      published: this.workEnvironment.published,
      draft: this.workEnvironment.draft
    };
  }

  submit() {
    if (this.isEdit) {
      this.updateWorkEnvironment();
    } else {
      this.createWorkEnvironment();
    }
  }


  cancel() {
    this.modal.dismiss();
  }

  private updateWorkEnvironment() {
    this.workEnvironmentRepository.update(this.workEnvironment.id, {
      description: this.form.get('description').value,
      draft: this.form.get('draft').value,
      published: this.form.get('published').value
    })
      .pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  private createWorkEnvironment() {
    this.workEnvironmentRepository.create(this.form.value)
      .pipe(catchError(this.handleFailure.bind(this)))

      .subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result) {
    this.notificationsService.success('portal.competence-catalog.work-environments.add-modal.added-success-notification');
    if (this.createAnotherFormControl.value === true) {
      this.form.reset({
        type: null,
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
