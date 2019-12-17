import { Component, OnInit } from '@angular/core';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';
import { CompetenceSetSearchResult } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import {
  CommonFilters,
  CompetenceCatalogAction
} from '../../shared/shared-competence-catalog.types';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { FormBuilder } from '@angular/forms';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceSetBacklinkComponent } from '../../shared/backlinks/competence-set-backlinks/competence-set-backlink.component';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FilterByStatusesModalComponent } from '../../shared/filter-by-statuses/filter-by-statuses-modal/filter-by-statuses-modal.component';

@Component({
  selector: 'alv-competence-sets-overview',
  templateUrl: './competence-sets-overview.component.html',
  styleUrls: ['./competence-sets-overview.component.scss']
})
export class CompetenceSetsOverviewComponent extends OverviewComponent<CompetenceSetSearchResult> implements OnInit {

  filter: CommonFilters = {};

  editCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.EDIT,
    icon: ['fas', 'pen'],
    label: 'portal.competence-catalog.competence-sets.edit-button.tooltip'
  };

  backlinkCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.competence-sets.overview.backlink'
  };

  actions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;

  constructor(protected itemsRepository: CompetenceSetRepository,
              private router: Router,
              private modalService: ModalService,
              protected fb: FormBuilder,
              private route: ActivatedRoute,
              protected authenticationService: AuthenticationService) {
    super(authenticationService, itemsRepository, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.actions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.editCompetenceSetAction, this.backlinkCompetenceSetAction] : [this.backlinkCompetenceSetAction]));
  }

  handleCompetenceSetActionClick(action: CompetenceCatalogAction, competenceSet: CompetenceSetSearchResult) {
    if (action === CompetenceCatalogAction.EDIT) {
      this.router.navigate(['edit', competenceSet.id], { relativeTo: this.route });
    }
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(competenceSet);
    }
  }

  private openBacklinkModal(competenceSetSearchResult: CompetenceSetSearchResult) {
    const modalRef = this.modalService.openMedium(CompetenceSetBacklinkComponent);
    (<CompetenceSetBacklinkComponent>modalRef.componentInstance).competenceSetSearchResult = competenceSetSearchResult;
  }

  onFilterClick() {
    const modalRef = this.modalService.openMedium(FilterByStatusesModalComponent, true);
    modalRef.componentInstance.currentFiltering = this.filter;
    modalRef.result
      .then(updatedFilter => {
        this.filter = updatedFilter;
        this.reload();
      })
      .catch(() => {
      });
  }

  onScroll() {
    this.loadItems({
      ...{ query: this.searchForm.get('query').value || '' },
      ...this.filter
    });
  }

}
