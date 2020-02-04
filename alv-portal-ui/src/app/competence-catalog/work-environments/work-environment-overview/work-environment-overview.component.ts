import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import {
  CompetenceCatalogAction,
  WorkEnvironmentFilterValues,
} from '../../shared/shared-competence-catalog.types';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { FormBuilder } from '@angular/forms';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import { NotificationsService } from '../../../core/notifications.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  WorkEnvironment,
  WorkEnvironmentType
} from '../../../shared/backend-services/competence-catalog/work-environment/work-environment.types';
import { WorkEnvironmentRepository } from '../../../shared/backend-services/competence-catalog/work-environment/work-environment-repository.service';
import { WorkEnvironmentModalComponent } from '../../shared/work-environment-modal/work-environment-modal.component';
import { WorkEnvironmentsFilterModalComponent } from '../work-environment-filter-modal/work-environment-filter-modal.component';
import { WorkEnvironmentBacklinkComponent } from '../../shared/backlinks/work-environment-backlinks/work-environment-backlink.component';
import { WorkEnvironmentDeleteComponent } from '../work-environment-delete/work-environment-delete.component';
import { HttpErrorResponse } from '@angular/common/http';
import { BusinessExceptionsHandlerService } from '../../shared/business-exceptions-handler.service';

@Component({
  selector: 'alv-work-environment-overview',
  templateUrl: './work-environment-overview.component.html',
  styleUrls: ['./work-environment-overview.component.scss']
})
export class WorkEnvironmentsOverviewComponent extends OverviewComponent<WorkEnvironment> implements OnInit {

  filter: WorkEnvironmentFilterValues = {
    types: Object.values(WorkEnvironmentType),
  };

  backlinkWorkEnvironmentAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.work-environments.overview.backlink'
  };

  deleteWorkEnvironmentAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.DELETE,
    icon: ['fas', 'trash'],
    label: 'entity.action.delete'
  };
  actions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;

  constructor(private modalService: ModalService,
              protected authenticationService: AuthenticationService,
              protected fb: FormBuilder,
              protected itemsRepository: WorkEnvironmentRepository,
              private notificationsService: NotificationsService,
              private businessExceptionsHandlerService: BusinessExceptionsHandlerService) {
    super(authenticationService, itemsRepository, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.actions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.backlinkWorkEnvironmentAction, this.deleteWorkEnvironmentAction] : [this.backlinkWorkEnvironmentAction])
    );
  }

  openCreateModal() {
    const modalRef = this.modalService.openLarge(WorkEnvironmentModalComponent);
    modalRef.result
      .then(this.reload.bind(this))
      .catch(this.reload.bind(this));

  }

  openUpdateModal(workEnvironment: WorkEnvironment, isReadonly: boolean) {
    const modalRef = this.modalService.openLarge(WorkEnvironmentModalComponent);
    const componentInstance = <WorkEnvironmentModalComponent>modalRef.componentInstance;
    componentInstance.workEnvironment = workEnvironment;
    componentInstance.isReadonly = isReadonly;
    modalRef.result
      .then(this.reload.bind(this))
      .catch(this.reload.bind(this));
  }

  onFilterClick() {
    const modalRef = this.modalService.openMedium(WorkEnvironmentsFilterModalComponent, true);
    modalRef.componentInstance.currentFiltering = this.filter;
    modalRef.result
      .then(updatedFilter => {
        this.filter = updatedFilter;
        this.reload();
      })
      .catch(this.reload.bind(this));
  }

  onScroll() {
    this.loadItems({
      ...{ query: this.searchForm.get('query').value || '' },
      ...this.filter
    });
  }

  handleWorkEnvironmentActionClick(action: CompetenceCatalogAction, workEnvironment: WorkEnvironment) {
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(workEnvironment);
    }
    if (action === CompetenceCatalogAction.DELETE) {
      this.openDeleteModal(workEnvironment);
    }
  }

  private openBacklinkModal(workEnvironment: WorkEnvironment) {
    const modalRef = this.modalService.openMedium(WorkEnvironmentBacklinkComponent, true);
    (<WorkEnvironmentBacklinkComponent>modalRef.componentInstance).workEnvironment = workEnvironment;
  }

  private openDeleteModal(workEnvironment: WorkEnvironment) {
    const modalRef = this.modalService.openLarge(WorkEnvironmentDeleteComponent, true);
    const componentInstance = <WorkEnvironmentDeleteComponent>modalRef.componentInstance;
    componentInstance.workEnvironment = workEnvironment.id;
    modalRef.result
      .then(idForDeletion => {
        this.itemsRepository.delete(idForDeletion)
          .pipe(catchError(this.handleFailure.bind(this)))
          .subscribe(() => {
            this.reload();
            this.notificationsService.success('portal.competence-catalog.work-environments.deleted-success-notification');
          });
      })
      .catch(this.reload.bind(this));
  }

  private handleFailure(error: HttpErrorResponse): Observable<never> {
    return this.businessExceptionsHandlerService.handleError(error);
  }
}
