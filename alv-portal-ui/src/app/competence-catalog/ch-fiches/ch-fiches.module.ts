import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedCompetenceCatalogModule } from '../shared/shared-competence-catalog.module';
import { ChFichesRoutingModule } from './ch-fiches-routing.module';
import { ChFichesOverviewComponent } from './ch-fiches-overview/ch-fiches-overview.component';
import { ChFicheDetailComponent } from './ch-fiche-detail/ch-fiche-detail.component';
import { ChFicheComponent } from './ch-fiche/ch-fiche.component';
import { CompetenceSetSearchModalComponent } from './competence-set-search-modal/competence-set-search-modal.component';
import { OccupationSearchModalComponent } from './occupation-search-modal/occupation-search-modal.component';
import { ChFicheTitleModalComponent } from './ch-fiche-title-modal/ch-fiche-title-modal.component';
import { ChFicheDescriptionModalComponent } from './ch-fiche-description-modal/ch-fiche-description-modal.component';
import { CompetenceSetInFicheSettingsModalComponent } from './ch-fiche/competence-set-in-fiche-settings-modal/competence-set-in-fiche-settings-modal.component';
import { PrerequisiteSearchModalComponent } from './prerequisite-search-modal/prerequisite-search-modal.component';
import { WorkEnvironmentSearchModalComponent } from './work-environment-search-modal/work-environment-search-modal.component';
import { FilterByKeyValuePipe } from './ch-fiche/filter-by-key-value.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChFichesRoutingModule,
    InfiniteScrollModule,
    SharedCompetenceCatalogModule,
  ],
  declarations: [
    ChFichesOverviewComponent,
    ChFicheDetailComponent,
    ChFicheComponent,
    CompetenceSetSearchModalComponent,
    OccupationSearchModalComponent,
    ChFicheTitleModalComponent,
    ChFicheDescriptionModalComponent,
    PrerequisiteSearchModalComponent,
    WorkEnvironmentSearchModalComponent,
    CompetenceSetInFicheSettingsModalComponent,
    FilterByKeyValuePipe
  ],
  entryComponents: [
    CompetenceSetSearchModalComponent,
    OccupationSearchModalComponent,
    ChFicheTitleModalComponent,
    ChFicheDescriptionModalComponent,
    PrerequisiteSearchModalComponent,
    WorkEnvironmentSearchModalComponent,
    CompetenceSetInFicheSettingsModalComponent
  ],
  providers: [
    ModalService
  ]
})
export class ChFichesModule {
}
