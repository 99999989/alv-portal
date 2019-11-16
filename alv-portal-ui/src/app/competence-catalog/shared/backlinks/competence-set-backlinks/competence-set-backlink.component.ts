import { Component, Inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CompetenceSetSearchResult } from '../../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { ChFicheRepository } from '../../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { ChFiche } from '../../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { WINDOW } from '../../../../core/window.service';

@Component({
  selector: 'alv-competence-set-backlink',
  templateUrl: './competence-set-backlink.component.html',
  styleUrls: ['./competence-set-backlink.component.scss']
})
export class CompetenceSetBacklinkComponent implements OnInit {

  competenceSetSearchResult: CompetenceSetSearchResult;
  chFiches$: Observable<ChFiche[]>;

  constructor(public activeModal: NgbActiveModal,
              public chFicheRepository: ChFicheRepository,
              private router: Router,
              @Inject(WINDOW) private win: Window
  ) {
  }

  ngOnInit() {
    this.chFiches$ = this.chFicheRepository.findByCompetenceSetId(this.competenceSetSearchResult.id);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  itemClicked(chFiche: ChFiche) {
    this.openInNewWindow(chFiche.id);
  }

  private openInNewWindow(chFicheId: string) {
    this.win.open(this.router.createUrlTree(['kk', 'ch-fiches', 'edit', chFicheId]).toString());
  }
}
