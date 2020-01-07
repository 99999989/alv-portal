import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { RequirementRepository } from '../../../shared/backend-services/competence-catalog/requirement/requirement.repository';
import { Requirement, } from '../../../shared/backend-services/competence-catalog/requirement/requirement.types';
import { RequirementModalComponent } from '../../shared/requirement-modal/requirement-modal.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { RequirementsFilterModalComponent } from '../requirements-filter-modal/requirements-filter-modal.component';
import {
  CommonFilters,
  CompetenceCatalogAction,
} from '../../shared/shared-competence-catalog.types';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { FormBuilder } from '@angular/forms';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import { RequirementBacklinkComponent } from '../../shared/backlinks/requirement-backlinks/requirement-backlink.component';
import { RequirementDeleteComponent } from '../requirement-delete/requirement-delete.component';
import { NotificationsService } from '../../../core/notifications.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'alv-requirements-overview',
  templateUrl: './requirements-overview.component.html',
  styleUrls: ['./requirements-overview.component.scss']
})
export class RequirementsOverviewComponent extends OverviewComponent<Requirement> implements OnInit {

  filter: CommonFilters = {};

  backlinkRequirementAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.requirements.overview.backlink'
  };

  deleteRequirementAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.DELETE,
    icon: ['fas', 'trash'],
    label: 'portal.competence-catalog.requirements.overview.delete.label'
  };
  actions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;

  constructor(private modalService: ModalService,
              protected authenticationService: AuthenticationService,
              protected fb: FormBuilder,
              protected itemsRepository: RequirementRepository,
              private notificationsService: NotificationsService) {
    super(authenticationService, itemsRepository, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.actions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.backlinkRequirementAction, this.deleteRequirementAction] : [this.backlinkRequirementAction])
    );
  }

  openCreateModal() {
    const modalRef = this.modalService.openMedium(RequirementModalComponent, true);
    modalRef.result
      .then(this.reload.bind(this))
      .catch(this.reload.bind(this));

  }

  openUpdateModal(competenceElement: Requirement, isReadonly: boolean) {
    const modalRef = this.modalService.openMedium(RequirementModalComponent, true);
    const componentInstance = <RequirementModalComponent>modalRef.componentInstance;
    componentInstance.competenceElement = competenceElement;
    componentInstance.isReadonly = isReadonly;
    modalRef.result
      .then(updatedRequirement => {
        this.reload();
        debugger;
      })
      .catch(() => {
        debugger;
      });
  }

  onFilterClick() {
    const modalRef = this.modalService.openMedium(RequirementsFilterModalComponent, true);
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

  handleRequirementActionClick(action: CompetenceCatalogAction, competenceElement: Requirement) {
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(competenceElement);
    }
    if (action === CompetenceCatalogAction.DELETE) {
      this.openDeleteModal(competenceElement);
    }
  }

  private openBacklinkModal(requirement: Requirement) {
    const modalRef = this.modalService.openMedium(RequirementBacklinkComponent);
    (<RequirementBacklinkComponent>modalRef.componentInstance).requirement = requirement;
  }

  private openDeleteModal(competenceElement: Requirement) {
    const modalRef = this.modalService.openLarge(RequirementDeleteComponent);
    const componentInstance = <RequirementDeleteComponent>modalRef.componentInstance;
    componentInstance.competenceElementId = competenceElement.id;
    modalRef.result
      .then(idForDeletion => {
        this.itemsRepository.delete(idForDeletion)
          .subscribe(() => {
            this.reload();
            this.notificationsService.success('portal.competence-catalog.requirements.deleted-success-notification');
          });
      })
      .catch(() => {
      });
  }
}
