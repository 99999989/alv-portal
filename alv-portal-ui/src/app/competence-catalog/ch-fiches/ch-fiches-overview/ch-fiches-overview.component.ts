import { Component, OnInit } from '@angular/core';
import { OccupationSuggestionService } from '../../../shared/occupations/occupation-suggestion.service';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { ChFiche } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { OccupationTypeaheadItem } from '../../../shared/occupations/occupation-typeahead-item';
import { Observable } from 'rxjs';

@Component({
  selector: 'alv-ch-fiches-overview',
  templateUrl: './ch-fiches-overview.component.html',
  styleUrls: ['./ch-fiches-overview.component.scss']
})
export class ChFichesOverviewComponent extends OverviewComponent<ChFiche> implements OnInit {

  searchForm: FormGroup;

  loadOccupationsFn = this.loadOccupations.bind(this);


  constructor(protected itemsRepository: ChFicheRepository,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              protected authenticationService: AuthenticationService,
              private occupationSuggestionService: OccupationSuggestionService) {
    super(authenticationService, itemsRepository);
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchForm = this.fb.group({
      query: [''],
      occupations: ['']
    });
  }

  loadOccupations(query: string): Observable<OccupationTypeaheadItem[]> {
    return this.occupationSuggestionService.fetchCompetenceCatalogOccupations(query);
  }

  editChFiche(chFiche: ChFiche) {
    this.router.navigate(['edit', chFiche.id], { relativeTo: this.route });
  }

}
