import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { PrerequisiteRepository } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite-repository.service';
import { Prerequisite, } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite.types';
import { PrerequisiteModalComponent } from '../../shared/prerequisite-modal/prerequisite-modal.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { PrerequisitesFilterModalComponent } from '../prerequisites-filter-modal/prerequisites-filter-modal.component';
import {
  CommonFilters,
  CompetenceCatalogAction,
} from '../../shared/shared-competence-catalog.types';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { FormBuilder } from '@angular/forms';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import { PrerequisiteBacklinkComponent } from '../../shared/backlinks/prerequisite-backlinks/prerequisite-backlink.component';
import { PrerequisiteDeleteComponent } from '../prerequisite-delete/prerequisite-delete.component';
import { NotificationsService } from '../../../core/notifications.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BusinessExceptionsHandlerService } from '../../shared/business-exceptions-handler.service';

@Component({
  selector: 'alv-prerequisites-overview',
  templateUrl: './prerequisites-overview.component.html',
  styleUrls: ['./prerequisites-overview.component.scss']
})
export class PrerequisitesOverviewComponent extends OverviewComponent<Prerequisite> implements OnInit {

  filter: CommonFilters = {};

  backlinkPrerequisiteAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.prerequisites.overview.backlink'
  };

  deletePrerequisiteAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.DELETE,
    icon: ['fas', 'trash'],
    label: 'entity.action.delete'
  };
  actions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;

  constructor(private modalService: ModalService,
              protected authenticationService: AuthenticationService,
              protected fb: FormBuilder,
              protected itemsRepository: PrerequisiteRepository,
              private notificationsService: NotificationsService,
              private businessExceptionsHandlerService: BusinessExceptionsHandlerService) {
    super(authenticationService, itemsRepository, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.actions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.backlinkPrerequisiteAction, this.deletePrerequisiteAction] : [this.backlinkPrerequisiteAction])
    );
  }

  openCreateModal() {
    const modalRef = this.modalService.openLarge(PrerequisiteModalComponent, false);
    modalRef.result
      .then(this.reload.bind(this))
      .catch(this.reload.bind(this));

  }

  openUpdateModal(prerequisite: Prerequisite, isReadonly: boolean) {
    const modalRef = this.modalService.openLarge(PrerequisiteModalComponent, false);
    const componentInstance = <PrerequisiteModalComponent>modalRef.componentInstance;
    componentInstance.prerequisite = prerequisite;
    componentInstance.isReadonly = isReadonly;
    modalRef.result
      .then(this.reload.bind(this))
      .catch(this.reload.bind(this));
  }

  onFilterClick() {
    const modalRef = this.modalService.openMedium(PrerequisitesFilterModalComponent, true);
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

  handlePrerequisiteActionClick(action: CompetenceCatalogAction, prerequisite: Prerequisite) {
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(prerequisite);
    }
    if (action === CompetenceCatalogAction.DELETE) {
      this.openDeleteModal(prerequisite);
    }
  }

  private openBacklinkModal(prerequisite: Prerequisite) {
    const modalRef = this.modalService.openMedium(PrerequisiteBacklinkComponent, true);
    (<PrerequisiteBacklinkComponent>modalRef.componentInstance).prerequisite = prerequisite;
  }

  private openDeleteModal(prerequisite: Prerequisite) {
    const modalRef = this.modalService.openLarge(PrerequisiteDeleteComponent, true);
    const componentInstance = <PrerequisiteDeleteComponent>modalRef.componentInstance;
    componentInstance.prerequisite = prerequisite.id;
    modalRef.result
      .then(idForDeletion => {
        this.itemsRepository.delete(idForDeletion)
          .pipe(catchError(this.handleFailure.bind(this)))
          .subscribe(() => {
            this.reload();
            this.notificationsService.success('portal.competence-catalog.prerequisites.deleted-success-notification');
          });
      })
      .catch(this.reload.bind(this));
  }

  private handleFailure(error: HttpErrorResponse): Observable<never> {
    return this.businessExceptionsHandlerService.handleError(error);
  }
}
