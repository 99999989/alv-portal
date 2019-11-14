import { Component, Inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceSetRepository } from '../../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';
import { Router } from '@angular/router';
import { WINDOW } from '../../../../core/window.service';
import { Observable } from 'rxjs';
import { CompetenceSetSearchResult } from '../../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { NotificationType } from '../../../../shared/layout/notifications/notification.model';

@Component({
  selector: 'alv-competence-element-delete',
  templateUrl: './competence-element-delete.component.html',
  styleUrls: ['./competence-element-delete.component.scss']
})
export class CompetenceElementDeleteComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              public competenceSetRepository: CompetenceSetRepository,
              private router: Router,
              @Inject(WINDOW) private win: Window) {
  }

  @Input()
  competenceElementId: string;

  competenceSets$: Observable<CompetenceSetSearchResult[]>;

  warning = {
    type: NotificationType.WARNING,
    messageKey: 'portal.competence-catalog.competence-elements.delete-modal.reference-found-alert',
    isSticky: true
  };

  ngOnInit() {
    this.competenceSets$ = this.competenceSetRepository.findByCompetenceElementId(this.competenceElementId);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  delete() {
    this.activeModal.close(this.competenceElementId);
  }

  itemClicked(setSearchResult: CompetenceSetSearchResult) {
    this.openInNewWindow(setSearchResult.id);
  }

  private openInNewWindow(setId: string) {
    this.win.open(this.router.createUrlTree(['kk', 'competence-sets', 'edit', setId]).toString());
  }

}
