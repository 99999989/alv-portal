import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftskillsRoutingModule } from './softskills-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { SoftskillsOverviewComponent } from './softskills-overview/softskills-overview.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedCompetenceCatalogModule } from '../shared/shared-competence-catalog.module';
import { SoftskillsFilterModalComponent } from './softskills-filter-modal/softskills-filter-modal.component';
import { SoftskillDeleteComponent } from './softskill-delete/softskill-delete.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SoftskillsRoutingModule,
    InfiniteScrollModule,
    SharedCompetenceCatalogModule
  ],
  declarations: [
    SoftskillsOverviewComponent,
    SoftskillsFilterModalComponent,
    SoftskillDeleteComponent
  ],
  entryComponents: [
    SoftskillsFilterModalComponent,
    SoftskillDeleteComponent
  ],
  providers: [
    ModalService
  ]
})
export class SoftskillsModule {
}
