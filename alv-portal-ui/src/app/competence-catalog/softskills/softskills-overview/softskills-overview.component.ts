import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { SoftskillRepository } from '../../../shared/backend-services/competence-catalog/softskill/softskill-repository.service';
import { Softskill, } from '../../../shared/backend-services/competence-catalog/softskill/softskill.types';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { SoftskillsFilterModalComponent } from '../softskills-filter-modal/softskills-filter-modal.component';
import {
  CommonFilters,
  CompetenceCatalogAction,
} from '../../shared/shared-competence-catalog.types';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { FormBuilder } from '@angular/forms';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import { SoftskillDeleteComponent } from '../softskill-delete/softskill-delete.component';
import { NotificationsService } from '../../../core/notifications.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BusinessExceptionsHandlerService } from '../../shared/business-exceptions-handler.service';
import { SoftskillModalComponent } from '../../shared/softskill-modal/softskill-modal.component';
import { SoftskillBacklinkComponent } from '../../shared/backlinks/softskill-backlinks/softskill-backlink.component';

@Component({
  selector: 'alv-softskills-overview',
  templateUrl: './softskills-overview.component.html',
  styleUrls: ['./softskills-overview.component.scss']
})
export class SoftskillsOverviewComponent extends OverviewComponent<Softskill> implements OnInit {

  filter: CommonFilters = {};

  backlinkSoftskillAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.softskills.overview.backlink'
  };

  deleteSoftskillAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.DELETE,
    icon: ['fas', 'trash'],
    label: 'entity.action.delete'
  };
  actions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;

  constructor(private modalService: ModalService,
              protected authenticationService: AuthenticationService,
              protected fb: FormBuilder,
              protected itemsRepository: SoftskillRepository,
              private notificationsService: NotificationsService,
              private businessExceptionsHandlerService: BusinessExceptionsHandlerService) {
    super(authenticationService, itemsRepository, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.actions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.backlinkSoftskillAction, this.deleteSoftskillAction] : [this.backlinkSoftskillAction])
    );
  }

  openCreateModal() {
    const modalRef = this.modalService.openLarge(SoftskillModalComponent, false);
    modalRef.result
      .then(this.reload.bind(this))
      .catch(this.reload.bind(this));

  }

  openUpdateModal(softskill: Softskill, isReadonly: boolean) {
    const modalRef = this.modalService.openLarge(SoftskillModalComponent, false);
    const componentInstance = <SoftskillModalComponent>modalRef.componentInstance;
    componentInstance.softskill = softskill;
    componentInstance.isReadonly = isReadonly;
    modalRef.result
      .then(() => {
        this.reload();
      })
      .catch(() => {
      });
  }

  onFilterClick() {
    const modalRef = this.modalService.openMedium(SoftskillsFilterModalComponent, true);
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

  handleSoftskillActionClick(action: CompetenceCatalogAction, softskill: Softskill) {
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(softskill);
    }
    if (action === CompetenceCatalogAction.DELETE) {
      this.openDeleteModal(softskill);
    }
  }

  private openBacklinkModal(softskill: Softskill) {
    const modalRef = this.modalService.openMedium(SoftskillBacklinkComponent);
    (<SoftskillBacklinkComponent>modalRef.componentInstance).softskill = softskill;
  }

  private openDeleteModal(softskill: Softskill) {
    const modalRef = this.modalService.openLarge(SoftskillDeleteComponent);
    const componentInstance = <SoftskillDeleteComponent>modalRef.componentInstance;
    componentInstance.softskill = softskill.id;
    modalRef.result
      .then(idForDeletion => {
        this.itemsRepository.delete(idForDeletion)
          .pipe(catchError(this.handleFailure.bind(this)))
          .subscribe(() => {
            this.reload();
            this.notificationsService.success('portal.competence-catalog.softskills.deleted-success-notification');
          });
      })
      .catch(() => {
      });
  }

  private handleFailure(error: HttpErrorResponse): Observable<never> {
    return this.businessExceptionsHandlerService.handleError(error);
  }
}
