import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationType } from '../../../../shared/layout/notifications/notification.model';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { ApplicationDocumentsRepository } from '../../../../shared/backend-services/application-documents/application-documents.repository';
import { AuthenticationService } from '../../../../core/auth/authentication.service';
import { finalize, flatMap, take } from 'rxjs/operators';
import { deleteApplicationDocumentModalConfig } from '../modal-config.types';
import { ModalService } from '../../../../shared/layout/modal/modal.service';
import { NotificationsService } from '../../../../core/notifications.service';
import {
  ApplicationDocument,
  ApplicationDocumentType
} from '../../../../shared/backend-services/application-documents/application-documents.types';
import { ValidationMessage } from '../../../../shared/forms/input/validation-messages/validation-message.model';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { FileSaverService } from '../../../../shared/file-saver/file-saver.service';


@Component({
  selector: 'alv-application-document-modal',
  templateUrl: './application-document-modal.component.html',
  styleUrls: ['./application-document-modal.component.scss']
})
export class ApplicationDocumentModalComponent implements OnInit {

  readonly ACCEPTED_FILE_TYPES = 'application/pdf';

  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  @Input() applicationDocument: ApplicationDocument;

  @Input() invalidatedDocumentTypes: ApplicationDocumentType[];

  isEdit: boolean;

  modalTitle: string;

  secondaryLabel: string;

  notificationType = NotificationType;

  form: FormGroup;

  uploadedBytes = 0;

  totalBytes = 100;

  downloadFile$: Observable<Blob>;

  progressSubscription: Subscription;

  documentTypes$ = of(Object.keys(ApplicationDocumentType).map(documentType => {
      return {
        value: documentType,
        label: 'portal.application-documents.document-type.' + documentType
      };
    })
  );

  documentTypeValidationMessages: ValidationMessage[] = [
    {
      error: 'required',
      message: 'portal.application-documents.edit-create-modal.document-type.validation.required'
    },
    {
      error: 'invalidDocumentType',
      message: 'portal.application-documents.edit-create-modal.document-type.validation.invalidDocumentType'
    }
  ];

  fileValidationMessages: ValidationMessage[] = [
    {
      error: 'required',
      message: 'portal.application-documents.edit-create-modal.file.validation.required'
    },
    {
      error: 'maxFilesCount',
      message: 'portal.application-documents.edit-create-modal.file.validation.maxFilesCount'
    },
    {
      error: 'invalidFileType',
      message: 'portal.application-documents.edit-create-modal.file.validation.invalidFileType'
    }
  ];

  constructor(private activeModal: NgbActiveModal,
              private authenticationService: AuthenticationService,
              private applicationDocumentsRepository: ApplicationDocumentsRepository,
              private notificationsService: NotificationsService,
              private fileSaverService: FileSaverService,
              private modalService: ModalService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.isEdit = !!this.applicationDocument;

    this.form = this.fb.group({
      documentType: [this.isEdit ? this.applicationDocument.documentType : '',
        [Validators.required, this.validateDocumentTypes(this.invalidatedDocumentTypes)]],
      file: ['', this.isEdit ? null : Validators.required]
    });

    this.modalTitle = 'portal.application-documents.edit-create-modal.' + (this.isEdit ? 'edit-title' : 'create-title');

    this.secondaryLabel = this.isEdit ? 'entity.action.delete' : null;

    this.downloadFile$ = this.isEdit ? this.applicationDocumentsRepository.downloadDocument(this.applicationDocument.id) :
      of(this.form.value.file);
  }

  submit() {
    this.uploadedBytes = 1;
    this.progressSubscription = this.authenticationService.getCurrentUser()
      .pipe(
        take(1),
        flatMap(user => this.applicationDocumentsRepository.uploadApplicationDocument({
          documentType: this.form.value.documentType,
          ownerUserId: user.id
        }, this.form.value.file)),
        finalize(() => this.uploadedBytes = 0)
      ).subscribe((event: HttpEvent<ApplicationDocument>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.totalBytes = event.total;
          this.uploadedBytes = event.loaded;
        }
        if (event.type === HttpEventType.Response) {

          this.activeModal.close();
        }
      });
  }

  delete() {
    this.modalService.openConfirm(
      deleteApplicationDocumentModalConfig
    ).result
      .then(result => {
        this.applicationDocumentsRepository.deleteApplicationDocument(this.applicationDocument.id)
          .subscribe(() => {
            this.notificationsService.success('portal.application-documents.notification.deleted');
            this.activeModal.close();
          });
      })
      .catch(() => {
      });
  }

  cancelRequest() {
    this.progressSubscription.unsubscribe();
  }

  cancel() {
    this.activeModal.dismiss();
  }

  private validateDocumentTypes(invalidatedDocumentTypes: ApplicationDocumentType[]): ValidatorFn {
    return (control: AbstractControl) => {
      if (invalidatedDocumentTypes.includes(control.value)) {
        return {
          'invalidDocumentType': true
        };
      }
      return null;
    };
  }
}


