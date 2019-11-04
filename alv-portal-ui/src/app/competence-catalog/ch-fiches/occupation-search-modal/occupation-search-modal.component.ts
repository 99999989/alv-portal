import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TypeaheadItem } from '../../../shared/forms/input/typeahead/typeahead-item';
import { take } from 'rxjs/operators';
import { CompetenceElement } from '../../../shared/backend-services/competence-element/competence-element.types';
import { I18nService } from '../../../core/i18n.service';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-set/competence-set.repository';
import { Observable } from 'rxjs';
import { OccupationTypeaheadItem } from '../../../shared/occupations/occupation-typeahead-item';
import { OccupationSuggestionService } from '../../../shared/occupations/occupation-suggestion.service';

@Component({
  selector: 'alv-competence-set-search-modal',
  templateUrl: './occupation-search-modal.component.html',
  styleUrls: ['./occupation-search-modal.component.scss']
})
export class OccupationSearchModalComponent implements OnInit {

  @Input() existingOccupations: string[];

  form: FormGroup;

  searchOccupationsFn = this.searchOccupations.bind(this);

  private currentLang: string;

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder,
              private i18nService: I18nService,
              private occupationSuggestionService: OccupationSuggestionService) { }

  ngOnInit() {
    this.form = this.fb.group({
      occupation: ['', Validators.required]
    });
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
  }

  submit() {
    this.modal.close(this.form.get('occupation').value);
  }

  cancel() {
    this.modal.dismiss();
  }

  searchOccupations(query: string): Observable<OccupationTypeaheadItem[]> {
    return this.occupationSuggestionService.fetchCompetenceCatalogOccupations(query);
  }

  /*
  TODO: implement typeahead with backend as soon as the reference-service is ready
  private searchOccupations(term: string): Observable<OccupationTypeaheadItem>[] {
    return this.occupationRepository.search({page: 0, size: DEFAULT_PAGE_SIZE, body: {query: term}}).pipe(
      map(occupationPage => occupationPage
        .content
        .filter(item => this.existingOccupations ? !this.existingOccupations.includes(item.id) : true)
        .map(this.mapToItem.bind(this)))
    );
  }

  private mapToItem(occupation: CompetenceSetSearchResult, index: number): TypeaheadItem<CompetenceSetSearchResult> {
    return new TypeaheadItem<CompetenceSetSearchResult>(
      'COMPETENCE_SET',
      occupation,
      getTranslatedString(occupation.knowHow.description, this.currentLang),
      index
    );
  }
  */
}
