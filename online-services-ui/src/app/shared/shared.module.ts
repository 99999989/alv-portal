import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { FileUploadModule } from 'ng2-file-upload';
import { AddressInputComponent } from './components/address-input/address-input.component';
import { DateIntervalBasicInputComponent } from './components/date-interval-basic-input/date-interval-basic-input.component';
import { DateIntervalInputComponent } from './components/date-interval-input/date-interval-input.component';
import { DocumentUploadComponent } from './components/upload/document-upload/document-upload.component';
import { FileIconComponent } from './components/upload/files-upload/file-icon/file-icon.component';
import { FilesUploadComponent } from './components/upload/files-upload/files-upload.component';
import { HumanizeBytesPipe } from './components/upload/files-upload/humanize-bytes.pipe';
import { UploadedFilePresentationComponent } from './components/upload/files-upload/uploaded-file/uploaded-file-presentation.component';
import { NotificationComponent } from './components/notification/notification.component';
import { YesNoInputComponent } from './components/yes-no-input/yes-no-input.component';
import { DocumentGroupUploadComponent } from './components/upload/document-group-upload/document-group-upload.component';
import { UploadedFileComponent } from './components/upload/files-upload/uploaded-file/uploaded-file/uploaded-file.component';

@NgModule({
  declarations: [
    NotificationComponent,
    AddressInputComponent,
    YesNoInputComponent,
    DateIntervalInputComponent,
    FilesUploadComponent,
    DocumentUploadComponent,
    DateIntervalBasicInputComponent,
    UploadedFilePresentationComponent,
    HumanizeBytesPipe,
    FileIconComponent,
    DocumentGroupUploadComponent,
    UploadedFileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule.forRoot(),
    NgbProgressbarModule.forRoot(),
    NgbDropdownModule.forRoot(),
    FileUploadModule,
    PrettyJsonModule

  ],
  entryComponents: [],
  exports: [
    NotificationComponent,
    AddressInputComponent,
    YesNoInputComponent,
    DateIntervalInputComponent,
    FilesUploadComponent,
    DocumentUploadComponent,
    UploadedFilePresentationComponent

  ],
  providers: []
})
export class SharedModule {
}


