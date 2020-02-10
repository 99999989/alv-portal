import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CompetenceSet,
  CompetenceSetSearchResult,
  initialCompetenceSetSearchResult
} from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';
import { NotificationsService } from '../../../core/notifications.service';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceCatalogEditorAwareComponent } from '../../shared/competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceSetDeleteModalComponent } from '../competence-set-delete-modal/competence-set-delete-modal.component';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import {
  CompetenceCatalogAction,
  WorkflowFormValue
} from '../../shared/shared-competence-catalog.types';
import { CompetenceSetBacklinkComponent } from '../../shared/backlinks/competence-set-backlinks/competence-set-backlink.component';
import { Observable } from 'rxjs';
import { defaultWorkflowValue } from '../../shared/constants';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { BusinessExceptionsHandlerService } from '../../shared/business-exceptions-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'alv-competence-set-detail',
  templateUrl: './competence-set-detail.component.html',
  styleUrls: ['./competence-set-detail.component.scss']
})
export class CompetenceSetDetailComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  competenceSet: CompetenceSetSearchResult;

  isEdit: boolean;

  readonly = false;

  form: FormGroup;

  workflowFormValue: WorkflowFormValue = defaultWorkflowValue;

  createAnotherFormControl: FormControl;

  backlinkCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.competence-sets.overview.backlink'
  };

  showErrors: boolean;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private router: Router,
              private modalService: ModalService,
              private notificationsService: NotificationsService,
              protected authenticationService: AuthenticationService,
              private competenceSetRepository: CompetenceSetRepository,
              private businessExceptionsHandlerService: BusinessExceptionsHandlerService) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.createAnotherFormControl = this.fb.control(false);
    this.isEdit = !!this.route.snapshot.data.competenceSet;
    if (this.route.snapshot.data.competenceSet) {
      this.competenceSet = this.route.snapshot.data.competenceSet;
    } else {
      this.reset();
    }
    this.form = this.fb.group({});

    this.workflowFormValue = {
      published: this.competenceSet.published,
      draft: this.competenceSet.draft
    };

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
      competenceElementIds: this.competenceSet.competenceElementIds,
      draft: this.form.get('draft').value,
      published: this.form.get('published').value
    }).pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  private updateCompetenceSet() {
    this.competenceSetRepository.update(this.competenceSet.id, {
      knowHowId: this.competenceSet.knowHow.id,
      competenceElementIds: this.competenceSet.competenceElementIds,
      draft: this.form.get('draft').value,
      published: this.form.get('published').value
    }).pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  isDeletable(): boolean {
    return !this.competenceSet.published;
  }


  deleteCompetenceSet() {
    if (!this.isDeletable()) {
      this.notificationsService.error('portal.competence-catalog.business-error-messages.cannot_delete_in_status_published');
    } else {
      const modalRef = this.modalService.openLarge(CompetenceSetDeleteModalComponent, true);
      (<CompetenceSetDeleteModalComponent>modalRef.componentInstance).competenceSetId = this.competenceSet.id;
      modalRef.result
        .then(value => {
          this.competenceSetRepository.delete(this.competenceSet.id)
            .pipe(catchError(this.handleFailure.bind(this)))
            .subscribe(() => {
              this.notificationsService.success('portal.competence-catalog.competence-sets.deleted-success-notification');
              this.router.navigate(['kk', 'competence-sets']);
            });
        })
        .catch(() => {
        });
    }
  }

  private handleSuccess(result: CompetenceSet) {
    this.notificationsService.success('portal.competence-catalog.competence-sets.added-success-notification');
    if (this.createAnotherFormControl.value === true) {
      this.reset();
    } else {
      this.router.navigate(['kk', 'competence-sets']);
    }
  }

  private handleFailure(error: HttpErrorResponse): Observable<never> {
    return this.businessExceptionsHandlerService.handleError(error);
  }

  handleCompetenceSetActionClick(action: CompetenceCatalogAction, competenceSet: CompetenceSetSearchResult) {
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(competenceSet);
    }
  }

  private openBacklinkModal(competenceSetSearchResult: CompetenceSetSearchResult) {
    const modalRef = this.modalService.openMedium(CompetenceSetBacklinkComponent, true);
    (<CompetenceSetBacklinkComponent>modalRef.componentInstance).competenceSetSearchResult = competenceSetSearchResult;
  }

  private reset() {
    this.competenceSet = initialCompetenceSetSearchResult();
    this.showErrors = false;
  }
}
