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
import { SortButtonComponent } from './sort/sort-button/sort-button.component';
import { CompetenceElementBacklinkComponent } from './backlinks/competence-element-backlinks/competence-element-backlink.component';
import { CompetenceSetBacklinkComponent } from './backlinks/competence-set-backlinks/competence-set-backlink.component';
import { CompetenceCatalogSortModalComponent } from './sort/competence-catalog-sort-modal/competence-catalog-sort-modal.component';
import { MultiLanguageStringComponent } from './multi-language-string/multi-language-string.component';
import { BooleanToTextPipe } from './utils/boolean-to-text.pipe';
import { FilterByStatusesFormComponent } from './filter-by-statuses/filter-by-statuses-form/filter-by-statuses-form.component';
import { FilterByStatusesModalComponent } from './filter-by-statuses/filter-by-statuses-modal/filter-by-statuses-modal.component';
import { PrerequisiteBacklinkComponent } from './backlinks/prerequisite-backlinks/prerequisite-backlink.component';
import { PrerequisiteModalComponent } from './prerequisite-modal/prerequisite-modal.component';
import { WorkEnvironmentModalComponent } from './work-environment-modal/work-environment-modal.component';
import { WorkEnvironmentBacklinkComponent } from './backlinks/work-environment-backlinks/work-environment-backlink.component';
import { SoftskillBacklinkComponent } from './backlinks/softskill-backlinks/softskill-backlink.component';
import { SoftskillModalComponent } from './softskill-modal/softskill-modal.component';
import { WorkflowFormComponent } from './workflow-form/workflow-form.component';

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
    CompetenceSetBacklinkComponent,
    CompetenceCatalogSortModalComponent,
    MultiLanguageStringComponent,
    BooleanToTextPipe,
    FilterByStatusesFormComponent,
    FilterByStatusesModalComponent,
    PrerequisiteBacklinkComponent,
    SoftskillBacklinkComponent,
    PrerequisiteModalComponent,
    SoftskillModalComponent,
    WorkEnvironmentModalComponent,
    WorkEnvironmentBacklinkComponent,
    WorkflowFormComponent
  ],
  providers: [],
  entryComponents: [
    CompetenceElementModalComponent,
    CompetenceElementBacklinkComponent,
    CompetenceSetBacklinkComponent,
    CompetenceCatalogSortModalComponent,
    FilterByStatusesModalComponent,
    PrerequisiteBacklinkComponent,
    PrerequisiteModalComponent,
    SoftskillModalComponent,
    SoftskillBacklinkComponent,
    WorkEnvironmentModalComponent,
    WorkEnvironmentBacklinkComponent
  ],
  exports: [
    CompetenceSetComponent,
    InteractiveListItemComponent,
    CompetenceItemsCollapsePanelComponent,
    CompetenceItemPlaceholderComponent,
    SortButtonComponent,
    CompetenceElementBacklinkComponent,
    CompetenceSetBacklinkComponent,
    CompetenceCatalogSortModalComponent,
    FilterByStatusesModalComponent,
    MultiLanguageStringComponent,
    BooleanToTextPipe,
    FilterByStatusesFormComponent,
    PrerequisiteBacklinkComponent,
    SoftskillBacklinkComponent,
    PrerequisiteModalComponent,
    SoftskillModalComponent,
    WorkEnvironmentBacklinkComponent,
    WorkEnvironmentModalComponent
  ]
})
export class SharedCompetenceCatalogModule {
}
