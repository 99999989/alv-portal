import { Component, OnInit } from '@angular/core';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.repository';
import { CompetenceSetSearchResult } from '../../../shared/backend-services/competence-catalog/competence-set/competence-set.types';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import { CompetenceCatalogAction } from '../../shared/shared-competence-catalog.types';
import { ActivatedRoute, Router } from '@angular/router';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { FormBuilder } from '@angular/forms';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CompetenceSetBacklinksComponent } from '../../shared/backlinks/competence-set-backlinks/competence-set-backlinks.component';

@Component({
  selector: 'alv-competence-sets-overview',
  templateUrl: './competence-sets-overview.component.html',
  styleUrls: ['./competence-sets-overview.component.scss']
})
export class CompetenceSetsOverviewComponent extends OverviewComponent<CompetenceSetSearchResult> implements OnInit {

  editCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.EDIT,
    icon: ['fas', 'pen'],
    label: 'portal.competence-catalog.competence-sets.edit-button.tooltip'
  };

  backlinkCompetenceSetAction: ActionDefinition<CompetenceCatalogAction> = {
    name: CompetenceCatalogAction.BACKLINK,
    icon: ['fas', 'link'],
    label: 'portal.competence-catalog.competence-sets.overview.backlink'
  };

  constructor(protected itemsRepository: CompetenceSetRepository,
              private router: Router,
              private modalService: ModalService,
              protected fb: FormBuilder,
              private route: ActivatedRoute,
              protected authenticationService: AuthenticationService) {
    super(authenticationService, itemsRepository, fb);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  handleCompetenceSetActionClick(action: CompetenceCatalogAction, competenceSet: CompetenceSetSearchResult) {
    if (action === CompetenceCatalogAction.EDIT) {
      this.router.navigate(['edit', competenceSet.id], { relativeTo: this.route });
    }
    if (action === CompetenceCatalogAction.BACKLINK) {
      this.openBacklinkModal(competenceSet);
    }
  }

  private openBacklinkModal(competenceSetSearchResult: CompetenceSetSearchResult) {
    const modalRef = this.modalService.openMedium(CompetenceSetBacklinksComponent);
    (<CompetenceSetBacklinksComponent>modalRef.componentInstance).competenceSetSearchResult = competenceSetSearchResult;
  }

}
