import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceSetRepository } from '../../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';
import { CompetenceElement } from '../../../../shared/backend-services/competence-catalog/competence-element/competence-element.types';
import { Observable } from 'rxjs';
import {
  CompetenceSet,
  CompetenceSetSearchResult
} from '../../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { Router } from '@angular/router';

@Component({
  selector: 'alv-competence-element-backlinks',
  templateUrl: './competence-element-backlinks.component.html',
  styleUrls: ['./competence-element-backlinks.component.scss']
})
export class CompetenceElementBacklinksComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
              public competenceSetRepository: CompetenceSetRepository,
              private router: Router
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
    this.activeModal.dismiss();
    this.router.navigate(['kk', 'competence-sets', 'edit', setSearchResult.id]);
    // console.log($event);
  }
}
