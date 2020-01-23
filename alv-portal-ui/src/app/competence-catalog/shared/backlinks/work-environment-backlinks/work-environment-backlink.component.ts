import { Component, Inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WorkEnvironment } from '../../../../shared/backend-services/competence-catalog/work-environment/work-environment.types';
import { ChFicheRepository } from '../../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { ChFiche } from '../../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { WINDOW } from '../../../../core/window.service';

@Component({
  selector: 'alv-work-environment-backlink',
  templateUrl: './work-environment-backlink.component.html',
  styleUrls: ['./work-environment-backlink.component.scss']
})
export class WorkEnvironmentBacklinkComponent implements OnInit {

  workEnvironment: WorkEnvironment;
  chFiches$: Observable<ChFiche[]>;

  constructor(public activeModal: NgbActiveModal,
              public chFicheRepository: ChFicheRepository,
              private router: Router,
              @Inject(WINDOW) private win: Window
  ) {
  }

  ngOnInit() {
    this.chFiches$ = this.chFicheRepository.findByWorkEnvironmentId(this.workEnvironment.id);
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
