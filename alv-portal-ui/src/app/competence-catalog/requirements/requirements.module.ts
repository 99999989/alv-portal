import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementsRoutingModule } from './requirements-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { RequirementsOverviewComponent } from './requirements-overview/requirements-overview.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedCompetenceCatalogModule } from '../shared/shared-competence-catalog.module';
import { RequirementsFilterModalComponent } from './requirements-filter-modal/requirements-filter-modal.component';
import { RequirementDeleteComponent } from './requirement-delete/requirement-delete.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RequirementsRoutingModule,
    InfiniteScrollModule,
    SharedCompetenceCatalogModule
  ],
  declarations: [
    RequirementsOverviewComponent,
    RequirementsFilterModalComponent,
    RequirementDeleteComponent
  ],
  entryComponents: [
    RequirementsFilterModalComponent,
    RequirementDeleteComponent
  ],
  providers: [
    ModalService
  ]
})
export class RequirementsModule {
}
