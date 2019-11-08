import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetenceElementsRoutingModule } from './competence-elements-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { CompetenceElementsOverviewComponent } from './competence-elements-overview/competence-elements-overview.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedCompetenceCatalogModule } from '../shared/shared-competence-catalog.module';
import { CompetenceElementsFilterModalComponent } from './competence-elements-filter-modal/competence-elements-filter-modal.component';
import { CompetenceElementBacklinksComponent } from './competence-elements-overview/competence-element-backlinks/competence-element-backlinks.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CompetenceElementsRoutingModule,
    InfiniteScrollModule,
    SharedCompetenceCatalogModule
  ],
  declarations: [
    CompetenceElementsOverviewComponent,
    CompetenceElementsFilterModalComponent,
    CompetenceElementBacklinksComponent
  ],
  entryComponents: [
    CompetenceElementsFilterModalComponent,
    CompetenceElementBacklinksComponent
  ],
  providers: [
    ModalService
  ]
})
export class CompetenceElementsModule {
}
