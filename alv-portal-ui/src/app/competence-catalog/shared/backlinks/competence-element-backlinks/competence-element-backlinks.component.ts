import { Component, Inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceSetRepository } from '../../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';
import { CompetenceElement } from '../../../../shared/backend-services/competence-catalog/competence-element/competence-element.types';
import { Observable } from 'rxjs';
import { CompetenceSetSearchResult } from '../../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { Router } from '@angular/router';
import { WINDOW } from '../../../../core/window.service';

@Component({
  selector: 'alv-competence-element-backlinks',
  templateUrl: './competence-element-backlinks.component.html',
  styleUrls: ['./competence-element-backlinks.component.scss']
})
export class CompetenceElementBacklinksComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              public competenceSetRepository: CompetenceSetRepository,
              private router: Router,
              @Inject(WINDOW) private win: Window
              ) {
  }

  competenceElement: CompetenceElement;
  sets$: Observable<CompetenceSetSearchResult[]>;

  ngOnInit() {
    this.sets$ = this.competenceSetRepository.findByCompetenceElementId(this.competenceElement.id);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  itemClicked(setSearchResult: CompetenceSetSearchResult) {
    this.openInNewWindow(setSearchResult.id);
  }

  private openInNewWindow(setId: string) {
    this.win.open(this.router.createUrlTree(['kk', 'competence-sets', 'edit', setId]).toString());
  }
}
