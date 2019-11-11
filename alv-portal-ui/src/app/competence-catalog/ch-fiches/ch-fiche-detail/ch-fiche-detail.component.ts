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

@Component({
  selector: 'alv-competence-set-detail',
  templateUrl: './ch-fiche-detail.component.html',
  styleUrls: ['./ch-fiche-detail.component.scss']
})
export class ChFicheDetailComponent extends CompetenceCatalogEditorAwareComponent implements OnInit {

  chFiche: ChFiche;

  isEdit: boolean;

  showErrors: boolean;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              protected authenticationService: AuthenticationService,
              private chFicheRepository: ChFicheRepository) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
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

  private createChFiche() {
    this.chFicheRepository.create({
      title: this.chFiche.title,
      description: this.chFiche.description,
      competences: this.chFiche.competences,
      occupations: this.chFiche.occupations
    }).subscribe(this.handleSuccess.bind(this));
  }

  private updateChFiche() {
    this.chFicheRepository.update(this.chFiche.id, {
      title: this.chFiche.title,
      description: this.chFiche.description,
      competences: this.chFiche.competences,
      occupations: this.chFiche.occupations,
      draft: this.chFiche.draft,
      published: this.chFiche.published
    }).subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result: CompetenceSet) {
    this.notificationsService.success('portal.competence-catalog.ch-fiches.added-success-notification');
    this.router.navigate(['kk', 'ch-fiches']);
  }
}
