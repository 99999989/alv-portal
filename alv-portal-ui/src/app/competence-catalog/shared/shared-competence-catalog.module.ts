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
import { CompetenceElementBacklinksComponent } from './backlinks/competence-element-backlinks/competence-element-backlinks.component';
import { CompetenceSetBacklinksComponent } from './backlinks/competence-set-backlinks/competence-set-backlinks.component';
import { CompetenceElementDeleteComponent } from './deletion/competence-element-delete/competence-element-delete.component';

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
    CompetenceElementBacklinksComponent,
    CompetenceSetBacklinksComponent,
    CompetenceElementDeleteComponent
  ],
  providers: [],
  entryComponents: [
    CompetenceElementModalComponent,
    CompetenceElementBacklinksComponent,
    CompetenceSetBacklinksComponent,
    CompetenceElementDeleteComponent
  ],
  exports: [
    CompetenceSetComponent,
    InteractiveListItemComponent,
    CompetenceItemsCollapsePanelComponent,
    CompetenceItemPlaceholderComponent,
    SortButtonComponent,
    CompetenceElementBacklinksComponent,
    CompetenceSetBacklinksComponent,
    CompetenceElementDeleteComponent
  ]
})
export class SharedCompetenceCatalogModule {
}
