import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ApplicationDocumentsRoutingModule } from './application-documents-routing.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { ApplicationDocumentsOverviewComponent } from './application-documents-overview/application-documents-overview.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ApplicationDocumentComponent } from './application-documents-overview/application-document/application-document.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ApplicationDocumentsRoutingModule,
    NgbDropdownModule,
    InfiniteScrollModule
  ],
  declarations: [
    ApplicationDocumentsOverviewComponent,
    ApplicationDocumentComponent,

  ],
  entryComponents: [
  ],
  providers: [
    ModalService
  ]
})
export class ApplicationDocumentsModule {
}
