import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { WorkEffortsRoutingModule } from './work-efforts-routing.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { WorkEffortsOverviewComponent } from './work-efforts-overview/work-efforts-overview.component';
import { WorkEffortFormComponent } from './work-effort-form/work-effort-form.component';
import { WorkEffortComponent } from './work-efforts-overview/work-effort/work-effort.component';
import { ProofOfWorkEffortsComponent } from './work-efforts-overview/proof-of-work-efforts/proof-of-work-efforts.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkEffortsFilterModalComponent } from './work-efforts-overview/work-efforts-filter-modal/work-efforts-filter-modal.component';
import { WorkEffortFormGuard } from './work-effort-form/work-effort-form.guard';
import { SuccessModalComponent } from './work-effort-form/success-modal/success-modal.component';
import { AssistantLinkComponent } from './work-effort-form/assistant-link/assistant-link.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProofOfWorkEffortsSubmitModalComponent } from './work-efforts-overview/proof-of-work-efforts/proof-of-work-efforts-submit-modal/proof-of-work-efforts-submit-modal.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorkEffortsRoutingModule,
    NgbDropdownModule,
    InfiniteScrollModule
  ],
  declarations: [
    WorkEffortsOverviewComponent,
    WorkEffortComponent,
    ProofOfWorkEffortsComponent,
    WorkEffortFormComponent,
    WorkEffortsFilterModalComponent,
    SuccessModalComponent,
    AssistantLinkComponent,
    ProofOfWorkEffortsSubmitModalComponent
  ],
  entryComponents: [
    WorkEffortsFilterModalComponent,
    SuccessModalComponent,
    ProofOfWorkEffortsSubmitModalComponent
  ],
  providers: [
    ModalService,
    WorkEffortFormGuard
  ]
})
export class WorkEffortsModule {
}
