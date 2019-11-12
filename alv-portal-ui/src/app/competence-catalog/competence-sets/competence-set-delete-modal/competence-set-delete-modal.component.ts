import {Component, Inject, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ChFicheRepository} from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import {take} from 'rxjs/operators';
import {I18nService} from '../../../core/i18n.service';
import {Observable} from 'rxjs';
import {ChFiche} from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import {Router} from '@angular/router';
import {WINDOW} from '../../../core/window.service';
import {NotificationType} from '../../../shared/layout/notifications/notification.model';

@Component({
  selector: 'alv-competence-set-delete-modal',
  templateUrl: './competence-set-delete-modal.component.html',
  styleUrls: ['./competence-set-delete-modal.component.scss']
})
export class CompetenceSetDeleteModalComponent implements OnInit {

  @Input() competenceSetId: string;

  chFiches$: Observable<Array<ChFiche>>;

  notificationType: NotificationType;

  private currentLang: string;

  constructor(private modal: NgbActiveModal,
              private i18nService: I18nService,
              private chFicheRepository: ChFicheRepository,
              private router: Router,
              @Inject(WINDOW) private win: Window) {
  }

  ngOnInit(): void {
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
    this.chFiches$ = this.chFicheRepository.findByCompetenceSetId(this.competenceSetId);
  }

  chFicheClick(chFiche: ChFiche) {
    this.openInNewWindow(chFiche.id);
  }

  submit() {
    this.modal.close(null);
  }

  cancel() {
    this.modal.dismiss();
  }

  private openInNewWindow(chFicheId: string) {
    this.win.open(this.router.createUrlTree(['kk', 'ch-fiches', 'edit', chFicheId]).toString());
  }
}
