import { Component, Inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Softskill } from '../../../../shared/backend-services/competence-catalog/softskill/softskill.types';
import { ChFicheRepository } from '../../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { ChFiche } from '../../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { WINDOW } from '../../../../core/window.service';

@Component({
  selector: 'alv-softskill-backlink',
  templateUrl: './softskill-backlink.component.html',
  styleUrls: ['./softskill-backlink.component.scss']
})
export class SoftskillBacklinkComponent implements OnInit {

  softskill: Softskill;
  chFiches$: Observable<ChFiche[]>;

  constructor(public activeModal: NgbActiveModal,
              public chFicheRepository: ChFicheRepository,
              private router: Router,
              @Inject(WINDOW) private win: Window
  ) {
  }

  ngOnInit() {
    this.chFiches$ = this.chFicheRepository.findBySoftskillId(this.softskill.id);
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
