import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CompetenceSetComponent } from './competence-set/competence-set.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceItemsCollapsePanelComponent } from './competence-items-collapse-panel/competence-items-collapse-panel.component';
import { RouterModule } from '@angular/router';
import { CompetenceElementModalComponent } from './competence-element-modal/competence-element-modal.component';
import { CompetenceItemComponent } from './competence-item/competence-item.component';
import { CompetenceItemPlaceholderComponent } from './competence-item-placeholder/competence-item-placeholder.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbCollapseModule,
    RouterModule
  ],
  declarations: [
    CompetenceSetComponent,
    CompetenceItemsCollapsePanelComponent,
    CompetenceElementModalComponent,
    CompetenceItemComponent,
    CompetenceItemPlaceholderComponent,
  ],
  providers: [],
  entryComponents: [
    CompetenceElementModalComponent
  ],
  exports: [
    CompetenceSetComponent,
    CompetenceItemComponent,
    CompetenceItemsCollapsePanelComponent,
    CompetenceItemPlaceholderComponent,
  ]
})
export class SharedCompetenceCatalogModule {
}
