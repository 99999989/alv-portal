import { Component, OnInit } from '@angular/core';
import { OccupationSuggestionService } from '../../../shared/occupations/occupation-suggestion.service';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { ChFiche } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { OccupationTypeaheadItem } from '../../../shared/occupations/occupation-typeahead-item';
import { Observable } from 'rxjs';
import { JobSearchRequestMapper } from '../../../job-advertisement/job-ad-search/state-management/effects';

@Component({
  selector: 'alv-ch-fiches-overview',
  templateUrl: './ch-fiches-overview.component.html',
  styleUrls: ['./ch-fiches-overview.component.scss']
})
export class ChFichesOverviewComponent extends OverviewComponent<ChFiche> implements OnInit {

  searchForm: FormGroup;

  loadOccupationsFn = this.loadOccupations.bind(this);

  occupationsControl: FormControl = this.fb.control('');

  constructor(protected itemsRepository: ChFicheRepository,
              protected fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              protected authenticationService: AuthenticationService,
              private occupationSuggestionService: OccupationSuggestionService) {
    super(authenticationService, itemsRepository, fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchForm.addControl('occupations', this.occupationsControl);
  }

  onScroll() {
    this.loadItems({
      query: this.searchForm.get('query').value || '',
      occupationCodes: this.isOccupationsNotEmpty() ? JobSearchRequestMapper.mapProfessionCodes(this.searchForm.get('occupations').value) : [],
    });
  }

  private isOccupationsNotEmpty() {
    return this.searchForm.get('occupations') && this.searchForm.get('occupations').value;
  }

  loadOccupations(query: string): Observable<OccupationTypeaheadItem[]> {
    return this.occupationSuggestionService.fetchCompetenceCatalogOccupations(query);
  }

  editChFiche(chFiche: ChFiche) {
    this.router.navigate(['edit', chFiche.id], { relativeTo: this.route });
  }

}
