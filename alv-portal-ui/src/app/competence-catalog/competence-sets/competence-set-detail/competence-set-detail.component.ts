import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CompetenceSet,
  CompetenceSetSearchResult,
  initialCompetenceSet
} from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';
import { NotificationsService } from '../../../core/notifications.service';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceCatalogEditorAwareComponent } from '../../shared/competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceSetDeleteModalComponent } from '../competence-set-delete-modal/competence-set-delete-modal.component';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import { CompetenceCatalogAction } from '../../shared/shared-competence-catalog.types';
import { Observable } from 'rxjs';
import { CompetenceSetBacklinkComponent } from '../../shared/backlinks/competence-set-backlinks/competence-set-backlink.component';

@Component({
  selector: 'alv-competence-set-detail',
  templateUrl: './competence-set-detail.component.html',
  styleUrls: ['./competence-set-detail.component.scss']
})
export class CompetenceSetDetailComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  competenceSet: CompetenceSetSearchResult;

  isEdit: boolean;

  backlinkCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.competence-sets.overview.backlink'
  };

  actions$: Observable<ActionDefinition<CompetenceCatalogAction>[]>;
  showErrors: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private modalService: ModalService,
              private notificationsService: NotificationsService,
              protected authenticationService: AuthenticationService,
              private competenceSetRepository: CompetenceSetRepository) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.isEdit = !!this.route.snapshot.data.competenceSet;
    this.competenceSet = this.route.snapshot.data.competenceSet || initialCompetenceSet();
  }

  saveCompetenceSet() {
    this.showErrors = true;
    if (this.competenceSet.knowHow) {
      if (this.isEdit) {
        this.updateCompetenceSet();
      } else {
        this.createCompetenceSet();
      }
    }
  }

  private createCompetenceSet() {
    this.competenceSetRepository.create({
      knowHowId: this.competenceSet.knowHow.id,
      competenceElementIds: this.competenceSet.competenceElementIds
    }).subscribe(this.handleSuccess.bind(this));
  }

  private updateCompetenceSet() {
    this.competenceSetRepository.update(this.competenceSet.id, {
      knowHowId: this.competenceSet.knowHow.id,
      competenceElementIds: this.competenceSet.competenceElementIds,
      draft: this.competenceSet.draft,
      published: this.competenceSet.published
    }).subscribe(this.handleSuccess.bind(this));
  }

  deleteCompetenceSet() {
    const modalRef = this.modalService.openLarge(CompetenceSetDeleteModalComponent);
    (<CompetenceSetDeleteModalComponent>modalRef.componentInstance).competenceSetId = this.competenceSet.id;
    modalRef.result
      .then(value => {
        this.competenceSetRepository.delete(this.competenceSet.id)
          .subscribe(() => {
            this.notificationsService.success('portal.competence-catalog.competence-sets.deleted-success-notification');
            this.router.navigate(['kk', 'competence-sets']);
          });
      })
      .catch(() => {});
  }

  private handleSuccess(result: CompetenceSet) {
    this.notificationsService.success('portal.competence-catalog.competence-sets.added-success-notification');
    this.router.navigate(['kk', 'competence-sets']);
  }

  handleCompetenceSetActionClick(action: CompetenceCatalogAction, competenceSet: CompetenceSetSearchResult) {
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(competenceSet);
    }
  }

  private openBacklinkModal(competenceSetSearchResult: CompetenceSetSearchResult) {
    const modalRef = this.modalService.openMedium(CompetenceSetBacklinkComponent);
    (<CompetenceSetBacklinkComponent>modalRef.componentInstance).competenceSetSearchResult = competenceSetSearchResult;
  }
}
