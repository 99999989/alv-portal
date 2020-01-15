import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrerequisitesRoutingModule } from './prerequisites-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { PrerequisitesOverviewComponent } from './prerequisites-overview/prerequisites-overview.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedCompetenceCatalogModule } from '../shared/shared-competence-catalog.module';
import { PrerequisitesFilterModalComponent } from './prerequisites-filter-modal/prerequisites-filter-modal.component';
import { PrerequisiteDeleteComponent } from './prerequisite-delete/prerequisite-delete.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PrerequisitesRoutingModule,
    InfiniteScrollModule,
    SharedCompetenceCatalogModule
  ],
  declarations: [
    PrerequisitesOverviewComponent,
    PrerequisitesFilterModalComponent,
    PrerequisiteDeleteComponent
  ],
  entryComponents: [
    PrerequisitesFilterModalComponent,
    PrerequisiteDeleteComponent
  ],
  providers: [
    ModalService
  ]
})
export class PrerequisitesModule {
}
