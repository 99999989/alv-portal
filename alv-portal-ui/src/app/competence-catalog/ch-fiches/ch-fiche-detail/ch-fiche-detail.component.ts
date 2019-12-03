import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetenceSet } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { NotificationsService } from '../../../core/notifications.service';
import {
  BusinessExceptionTypes,
  ChFiche,
  initialChFiche
} from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceCatalogEditorAwareComponent } from '../../shared/competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { catchError, takeUntil } from 'rxjs/operators';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { EMPTY, throwError } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'alv-competence-set-detail',
  templateUrl: './ch-fiche-detail.component.html',
  styleUrls: ['./ch-fiche-detail.component.scss']
})
export class ChFicheDetailComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  chFiche: ChFiche;

  createAnotherFormControl: FormControl;

  isEdit: boolean;

  showErrors: boolean;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              protected authenticationService: AuthenticationService,
              private modalService: ModalService,
              private chFicheRepository: ChFicheRepository,
              private fb: FormBuilder) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.createAnotherFormControl = this.fb.control(false);
    this.isEdit = !!this.route.snapshot.data.chFiche;
    this.chFiche = this.route.snapshot.data.chFiche || initialChFiche();
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

  deleteChFiche() {
    const modalRef = this.modalService.openConfirm({
      title: 'portal.competence-catalog.ch-fiches.delete-modal.title',
      content: 'portal.competence-catalog.ch-fiches.delete-modal.confirmation',
      confirmLabel: 'portal.global.delete-confirm'
    });
    modalRef.result
      .then(() => {
        this.chFicheRepository.delete(this.chFiche.id)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.notificationsService.success('portal.competence-catalog.ch-fiches.removed-ch-fiche-success-notification');
            this.router.navigate(['..'], { relativeTo: this.route });
          });
      })
      .catch(() => {
      });
  }

  private createChFiche() {
    this.chFicheRepository.create({
      title: this.chFiche.title,
      description: this.chFiche.description,
      competences: this.chFiche.competences,
      occupations: this.chFiche.occupations
    }).pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  private updateChFiche() {
    this.chFicheRepository.update(this.chFiche.id, {
      title: this.chFiche.title,
      description: this.chFiche.description,
      competences: this.chFiche.competences,
      occupations: this.chFiche.occupations,
      draft: this.chFiche.draft,
      published: this.chFiche.published
    }).pipe(catchError(this.handleFailure.bind(this)))
      .subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result: CompetenceSet) {
    this.notificationsService.success('portal.competence-catalog.ch-fiches.added-success-notification');
    if (this.createAnotherFormControl.value === true) {
      this.chFiche = initialChFiche();
    } else {
      this.router.navigate(['kk', 'ch-fiches']);
    }
  }

  private handleFailure(error) {
    if (error.error['business-exception-type'] === BusinessExceptionTypes.BFS_CODE_ALREADY_REFERENCED_IN_CH_FICHE) {
      this.notificationsService.error('portal.competence-catalog.ch-fiches.duplicated-beruf-error-notification');
      return EMPTY;
    }
    return throwError;
  }


}
