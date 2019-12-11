import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IconKey } from '../../../shared/icons/custom-icon/custom-icon.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { filter, flatMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ModalService } from '../../../shared/layout/modal/modal.service';

import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import {
  Notification,
  NotificationType
} from '../../../shared/layout/notifications/notification.model';
import { I18nService } from '../../../core/i18n.service';
import { Languages } from '../../../core/languages.constants';
import { ApplicationDocumentsRepository } from '../../../shared/backend-services/application-documents/application-documents.repository';
import { ApplicationDocumentModalComponent } from './application-document-modal/application-document-modal.component';
import { NotificationsService } from '../../../core/notifications.service';
import {
  ApplicationDocument,
  ApplicationDocumentType
} from '../../../shared/backend-services/application-documents/application-documents.types';
import {
  ApplicationDocumentSortType,
  ApplicationDocumentsSortingService
} from './application-documents-sorting.service';

@Component({
  selector: 'alv-application-documents-overview',
  templateUrl: './application-documents-overview.component.html',
  styleUrls: ['./application-documents-overview.component.scss']
})
export class ApplicationDocumentsOverviewComponent extends AbstractSubscriber implements OnInit {

  englishNotSupportedNotification: Notification = {
    type: NotificationType.ERROR,
    messageKey: 'portal.online-forms.notification.no-english',
    isSticky: true
  };
  uploadInstructionNotification: Notification = {
    type: NotificationType.INFO,
    isSticky: true
  };

  IconKey = IconKey;

  applicationDocuments: ApplicationDocument[] = [];

  isEnglishLanguageSelected$: Observable<boolean>;

  showUploadInstruction = true;

  selectedSortType = ApplicationDocumentSortType.BY_DATE;

  private readonly MAX_DOCUMENTS_PER_TYPE = 6;

  constructor(private fb: FormBuilder,
              private modalService: ModalService,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              private notificationsService: NotificationsService,
              private applicationDocumentsSortingService: ApplicationDocumentsSortingService,
              private applicationDocumentsRepository: ApplicationDocumentsRepository) {
    super();
  }

  ngOnInit() {
    this.isEnglishLanguageSelected$ = this.i18nService.currentLanguage$.pipe(
      map(language => language === Languages.EN)
    );

    this.getAllApplicationDocuments();
  }

  getAllApplicationDocuments() {
    this.authenticationService.getCurrentUser().pipe(
      filter(user => !!user),
      flatMap(user => this.applicationDocumentsRepository.findByOwnerUserId(user.id)),
    ).subscribe(applicationDocuments => {
      this.applicationDocuments = this.applicationDocumentsSortingService.sort(applicationDocuments, this.selectedSortType);
    });
  }

  openModal(applicationDocument?: ApplicationDocument) {
    const modalRef = this.modalService.openMedium(ApplicationDocumentModalComponent);
    modalRef.componentInstance.applicationDocument = applicationDocument;
    modalRef.componentInstance.invalidDocumentTypes = this.calculateInvalidDocumentTypes(applicationDocument ? applicationDocument.documentType : null);
    modalRef.result
      .then(result => {
        this.getAllApplicationDocuments();
      })
      .catch(err => {
      });
  }

  dismissUploadInstruction() {
    this.showUploadInstruction = false;
  }

  applySortByDate() {
    this.applicationDocuments = this.applicationDocumentsSortingService.sortByDate(this.applicationDocuments);
    this.selectedSortType = ApplicationDocumentSortType.BY_DATE;
  }

  applySortByDocumentType() {
    this.applicationDocuments = this.applicationDocumentsSortingService.sortByDocumentType(this.applicationDocuments);
    this.selectedSortType = ApplicationDocumentSortType.BY_DOCUMENT_TYPE;
  }

  applySortByFilename() {
    this.applicationDocuments = this.applicationDocumentsSortingService.sortByFilename(this.applicationDocuments);
    this.selectedSortType = ApplicationDocumentSortType.BY_FILENAME;
  }

  private calculateInvalidDocumentTypes(excludedDocumentType: ApplicationDocumentType): ApplicationDocumentType[] {
    return Object.values(ApplicationDocumentType).reduce((invalidDocumentTypes, currentDocumentType) => {
      if (currentDocumentType !== excludedDocumentType && this.checkDocumentTypeLimitReached(this.applicationDocuments, currentDocumentType)) {
        invalidDocumentTypes.push(currentDocumentType);
      }
      return invalidDocumentTypes;
    }, []);
  }

  private checkDocumentTypeLimitReached(applicationDocuments: ApplicationDocument[], documentType: ApplicationDocumentType): boolean {
    return applicationDocuments.filter(doc => doc.documentType === documentType).length >= this.MAX_DOCUMENTS_PER_TYPE;
  }
}
