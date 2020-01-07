import { Component, Inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { WINDOW } from '../../../core/window.service';
import { Observable } from 'rxjs';
import { NotificationType } from '../../../shared/layout/notifications/notification.model';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { ChFiche } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';

@Component({
  selector: 'alv-requirement-delete',
  templateUrl: './requirement-delete.component.html',
  styleUrls: ['./requirement-delete.component.scss']
})
export class RequirementDeleteComponent implements OnInit {

  @Input()
  competenceElementId: string;
  chFiches$: Observable<ChFiche[]>;
  warning = {
    type: NotificationType.WARNING,
    messageKey: 'portal.competence-catalog.requirements.delete-modal.reference-found-alert',
    isSticky: true
  };

  constructor(public activeModal: NgbActiveModal,
              public chFicheRepository: ChFicheRepository,
              private router: Router,
              @Inject(WINDOW) private win: Window) {
  }

  ngOnInit() {
    this.chFiches$ = this.chFicheRepository.findByRequirementId(this.competenceElementId);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  delete() {
    this.activeModal.close(this.competenceElementId);
  }

  itemClicked(setSearchResult: ChFiche) {
    this.openInNewWindow(setSearchResult.id);
  }

  private openInNewWindow(setId: string) {
    this.win.open(this.router.createUrlTree(['kk', 'competence-sets', 'edit', setId]).toString());
  }

}
