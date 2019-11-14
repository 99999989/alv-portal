import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { CompetenceSetComponent } from './competence-set/competence-set.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceItemsCollapsePanelComponent } from './competence-items-collapse-panel/competence-items-collapse-panel.component';
import { RouterModule } from '@angular/router';
import { CompetenceElementModalComponent } from './competence-element-modal/competence-element-modal.component';
import { InteractiveListItemComponent } from './interactive-list-item/interactive-list-item.component';
import { CompetenceItemPlaceholderComponent } from './competence-item-placeholder/competence-item-placeholder.component';
import { SortButtonComponent } from './sort-button/sort-button.component';
import { CompetenceElementBacklinkComponent } from './backlinks/competence-element-backlinks/competence-element-backlink.component';
import { CompetenceSetBacklinkComponent } from './backlinks/competence-set-backlinks/competence-set-backlink.component';

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
    InteractiveListItemComponent,
    CompetenceItemPlaceholderComponent,
    SortButtonComponent,
    CompetenceElementBacklinkComponent,
    CompetenceSetBacklinkComponent
  ],
  providers: [],
  entryComponents: [
    CompetenceElementModalComponent,
    CompetenceElementBacklinkComponent,
    CompetenceSetBacklinkComponent

  ],
  exports: [
    CompetenceSetComponent,
    InteractiveListItemComponent,
    CompetenceItemsCollapsePanelComponent,
    CompetenceItemPlaceholderComponent,
    SortButtonComponent,
    CompetenceElementBacklinkComponent,
    CompetenceSetBacklinkComponent
  ]
})
export class SharedCompetenceCatalogModule {
}
