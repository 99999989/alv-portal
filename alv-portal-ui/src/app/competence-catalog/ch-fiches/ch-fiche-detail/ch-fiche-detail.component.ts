import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetenceSet } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { NotificationsService } from '../../../core/notifications.service';
import {
  ChFiche,
  initialChFiche
} from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceCatalogEditorAwareComponent } from '../../shared/competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { catchError, takeUntil } from 'rxjs/operators';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BusinessExceptionsHandlerService } from '../../shared/business-exceptions-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkflowFormValue } from '../../shared/shared-competence-catalog.types';

@Component({
  selector: 'alv-competence-set-detail',
  templateUrl: './ch-fiche-detail.component.html',
  styleUrls: ['./ch-fiche-detail.component.scss']
})
export class ChFicheDetailComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  chFiche: ChFiche;

  createAnotherFormControl: FormControl;

  isEdit: boolean;

  form: FormGroup;

  workflowFormValue: WorkflowFormValue = {
    published: false,
    draft: true
  };

  showErrors: boolean;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              protected authenticationService: AuthenticationService,
              private modalService: ModalService,
              private chFicheRepository: ChFicheRepository,
              private fb: FormBuilder,
              private businessExceptionsHandlerService: BusinessExceptionsHandlerService) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.createAnotherFormControl = this.fb.control(false);
    this.isEdit = !!this.route.snapshot.data.chFiche;
    this.form = this.fb.group({});
    if (this.route.snapshot.data.chFiche) {
      this.chFiche = this.route.snapshot.data.chFiche;
      this.workflowFormValue = {
        published: this.chFiche.published,
        draft: this.chFiche.draft
      };
    } else {
      this.reset();
    }
  }

  reset() {
    this.chFiche = initialChFiche();
    this.showErrors = false;
  }

  saveChFiche() {
    this.showErrors = true;
    if (this.chFiche.title) {
      if (this.isEdit) {
        this.updateChFiche();
      } else {
        this.createChFiche();
      }
    }
  }

  isDeletable(): boolean {
    return !this.chFiche.published;
  }


  deleteChFiche() {
    if (!this.isDeletable()) {
      this.notificationsService.error('portal.competence-catalog.business-error-messages.cannot_delete_in_status_published');
    } else {
      const modalRef = this.modalService.openConfirm({
        title: 'portal.competence-catalog.ch-fiches.delete-modal.title',
        content: 'portal.competence-catalog.ch-fiches.delete-modal.confirmation',
        confirmLabel: 'portal.global.delete-confirm'
      });
      modalRef.result
        .then(() => {
          this.chFicheRepository.delete(this.chFiche.id)
            .pipe(
              catchError(this.handleFailure.bind(this)),
              takeUntil(this.ngUnsubscribe),
            )
            .subscribe(() => {
              this.notificationsService.success('portal.competence-catalog.ch-fiches.removed-ch-fiche-success-notification');
              this.router.navigate(['..'], { relativeTo: this.route });
            });
        })
        .catch(() => {
        });
    }
  }

  private createChFiche() {
    this.chFicheRepository.create({
      title: this.chFiche.title,
      description: this.chFiche.description,
      competences: this.chFiche.competences,
      occupations: this.chFiche.occupations,
      draft: this.form.get('draft').value,
      published: this.form.get('published').value,
      prerequisiteIds: this.chFiche.prerequisiteIds,
      softskillIds: this.chFiche.softskillIds,
      workEnvironmentIds: this.chFiche.workEnvironmentIds,
    }).pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  private updateChFiche() {
    this.chFicheRepository.update(this.chFiche.id, {
      title: this.chFiche.title,
      description: this.chFiche.description,
      competences: this.chFiche.competences,
      occupations: this.chFiche.occupations,
      draft: this.form.get('draft').value,
      published: this.form.get('published').value,
      prerequisiteIds: this.chFiche.prerequisiteIds,
      softskillIds: this.chFiche.softskillIds,
      workEnvironmentIds: this.chFiche.workEnvironmentIds,
    }).pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result: CompetenceSet) {
    this.notificationsService.success('portal.competence-catalog.ch-fiches.added-success-notification');
    if (this.createAnotherFormControl.value === true) {
      this.reset();
    } else {
      this.router.navigate(['kk', 'ch-fiches']);
    }
  }

  private handleFailure(error: HttpErrorResponse): Observable<never> {
    return this.businessExceptionsHandlerService.handleError(error);
  }


}
