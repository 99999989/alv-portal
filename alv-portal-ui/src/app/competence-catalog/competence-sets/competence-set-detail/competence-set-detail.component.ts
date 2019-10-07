import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CompetenceSet,
  CompetenceSetSearchResult,
  initialCompetenceSet
} from '../../../shared/backend-services/competence-set/competence-set.types';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-set/competence-set.repository';
import { NotificationsService } from '../../../core/notifications.service';

@Component({
  selector: 'alv-competence-set-detail',
  templateUrl: './competence-set-detail.component.html',
  styleUrls: ['./competence-set-detail.component.scss']
})
export class CompetenceSetDetailComponent implements OnInit {

  competenceSet: CompetenceSetSearchResult;

  isEdit: boolean;

  showErrors: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationsService: NotificationsService,
              private competenceSetRepository: CompetenceSetRepository) { }

  ngOnInit() {
    this.isEdit = !!this.route.snapshot.data.competenceSet;
    this.competenceSet = this.route.snapshot.data.competenceSet || {...initialCompetenceSet};
  }

  saveCompetenceSet() {
    this.showErrors = true;
    if (this.competenceSet.knowHow) {
      if (this.isEdit) {
        this.updateCompetenceSet();
      } else {
        this.createCompetenceSet();
      }
    }
  }

  private createCompetenceSet() {
    this.competenceSetRepository.create({
      knowHowId: this.competenceSet.knowHow.id,
      competenceElementIds: this.competenceSet.competenceElementIds
    }).subscribe(this.handleSuccess.bind(this));
  }

  private updateCompetenceSet() {
    this.competenceSetRepository.update(this.competenceSet.id, {
      knowHowId: this.competenceSet.knowHow.id,
      competenceElementIds: this.competenceSet.competenceElementIds,
      draft: this.competenceSet.draft,
      published: this.competenceSet.published
    }).subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result: CompetenceSet) {
    this.notificationsService.success('portal.competence-catalog.competence-sets.added-success-notification');
    this.router.navigate(['kk', 'sets']);
  }
}
