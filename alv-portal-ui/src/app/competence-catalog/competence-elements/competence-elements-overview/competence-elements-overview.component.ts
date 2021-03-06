import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceElementRepository } from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.repository';
import {
  CompetenceElement,
  ElementType
} from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.types';
import { CompetenceElementModalComponent } from '../../shared/competence-element-modal/competence-element-modal.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceElementsFilterModalComponent } from '../competence-elements-filter-modal/competence-elements-filter-modal.component';
import {
  CompetenceCatalogAction,
  CompetenceElementFilterValues
} from '../../shared/shared-competence-catalog.types';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { FormBuilder } from '@angular/forms';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import { CompetenceElementBacklinkComponent } from '../../shared/backlinks/competence-element-backlinks/competence-element-backlink.component';
import { CompetenceElementDeleteComponent } from '../competence-element-delete/competence-element-delete.component';
import { NotificationsService } from '../../../core/notifications.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { BusinessExceptionsHandlerService } from '../../shared/business-exceptions-handler.service';

@Component({
  selector: 'alv-competence-elements-overview',
  templateUrl: './competence-elements-overview.component.html',
  styleUrls: ['./competence-elements-overview.component.scss']
})
export class CompetenceElementsOverviewComponent extends OverviewComponent<CompetenceElement> implements OnInit {

  filter: CompetenceElementFilterValues = {
    types: Object.values(ElementType)
  };

  backlinkCompetenceElementAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.competence-elements.overview.backlink'
  };

  deleteCompetenceElementAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.DELETE,
    icon: ['fas', 'trash'],
    label: 'portal.competence-catalog.competence-elements.overview.delete.label'
  };
  actions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;

  constructor(private modalService: ModalService,
              protected authenticationService: AuthenticationService,
              protected fb: FormBuilder,
              protected itemsRepository: CompetenceElementRepository,
              private notificationsService: NotificationsService,
              private businessExceptionsHandlerService: BusinessExceptionsHandlerService) {
    super(authenticationService, itemsRepository, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.actions$ = this.isCompetenceCatalogEditor$.pipe(
      map(isEditor => isEditor ? [this.backlinkCompetenceElementAction, this.deleteCompetenceElementAction] : [this.backlinkCompetenceElementAction])
    );
  }

  openCreateModal() {
    const modalRef = this.modalService.openLarge(CompetenceElementModalComponent, false);
    modalRef.result
      .then(this.reload.bind(this))
      .catch(this.reload.bind(this));

  }

  openUpdateModal(competenceElement: CompetenceElement, isReadonly: boolean) {
    const modalRef = this.modalService.openLarge(CompetenceElementModalComponent, false);
    const componentInstance = <CompetenceElementModalComponent>modalRef.componentInstance;
    componentInstance.competenceElement = competenceElement;
    componentInstance.isReadonly = isReadonly;
    modalRef.result
      .then(this.reload.bind(this))
      .catch(this.reload.bind(this));
  }

  onFilterClick() {
    const modalRef = this.modalService.openMedium(CompetenceElementsFilterModalComponent, true);
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

  handleCompetenceElementActionClick(action: CompetenceCatalogAction, competenceElement: CompetenceElement) {
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(competenceElement);
    }
    if (action === CompetenceCatalogAction.DELETE) {
      this.openDeleteModal(competenceElement);
    }
  }

  private openBacklinkModal(competenceElement: CompetenceElement) {
    const modalRef = this.modalService.openMedium(CompetenceElementBacklinkComponent, true);
    (<CompetenceElementBacklinkComponent>modalRef.componentInstance).competenceElement = competenceElement;
  }

  private openDeleteModal(competenceElement: CompetenceElement) {
    const modalRef = this.modalService.openLarge(CompetenceElementDeleteComponent, true);
    const componentInstance = <CompetenceElementDeleteComponent>modalRef.componentInstance;
    componentInstance.competenceElementId = competenceElement.id;
    modalRef.result
      .then(idForDeletion => {
        this.itemsRepository.delete(idForDeletion)
          .pipe(catchError(this.handleFailure.bind(this)))
          .subscribe(() => {
            this.reload();
            this.notificationsService.success('portal.competence-catalog.competence-elements.deleted-success-notification');
          });
      })
      .catch((this.reload.bind(this)));
  }

  private handleFailure(error: HttpErrorResponse): Observable<never> {
    return this.businessExceptionsHandlerService.handleError(error);
  }
}
