import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedCompetenceCatalogModule } from '../shared/shared-competence-catalog.module';
import { WorkEnvironmentsOverviewComponent } from './work-environment-overview/work-environment-overview.component';
import { WorkEnvironmentsFilterModalComponent } from './work-environment-filter-modal/work-environment-filter-modal.component';
import { WorkEnvironmentDeleteComponent } from './work-environment-delete/work-environment-delete.component';
import { WorkEnvironmentsRoutingModule } from './work-environments-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WorkEnvironmentsRoutingModule,
    InfiniteScrollModule,
    SharedCompetenceCatalogModule
  ],
  declarations: [
    WorkEnvironmentsOverviewComponent,
    WorkEnvironmentsFilterModalComponent,
    WorkEnvironmentDeleteComponent
  ],
  entryComponents: [
    WorkEnvironmentsFilterModalComponent,
    WorkEnvironmentDeleteComponent
  ],
  providers: [
    ModalService
  ]
})
export class WorkEnvironmentsModule {
}
