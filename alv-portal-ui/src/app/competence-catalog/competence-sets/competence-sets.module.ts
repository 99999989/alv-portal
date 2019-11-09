import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetenceSetsRoutingModule } from './competence-sets-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { CompetenceSetsOverviewComponent } from './competence-sets-overview/competence-sets-overview.component';
import { SharedCompetenceCatalogModule } from '../shared/shared-competence-catalog.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CompetenceSetDetailComponent } from './competence-set-detail/competence-set-detail.component';
import { CompetenceElementSearchModalComponent } from './competence-element-search-modal/competence-element-search-modal.component';
import { CompetenceSetBacklinksComponent } from './competence-sets-overview/competence-set-backlinks/competence-set-backlinks.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CompetenceSetsRoutingModule,
    SharedCompetenceCatalogModule,
    InfiniteScrollModule
  ],
  declarations: [
    CompetenceSetsOverviewComponent,
    CompetenceSetDetailComponent,
    CompetenceElementSearchModalComponent,
    CompetenceSetBacklinksComponent
  ],
  entryComponents: [
    CompetenceElementSearchModalComponent,
    CompetenceSetBacklinksComponent
  ],
  providers: [
    ModalService
  ]
})
export class CompetenceSetsModule {
}
