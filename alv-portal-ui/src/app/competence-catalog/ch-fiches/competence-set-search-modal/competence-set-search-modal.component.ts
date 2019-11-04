import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TypeaheadItem } from '../../../shared/forms/input/typeahead/typeahead-item';
import { map, take } from 'rxjs/operators';
import { CompetenceElement } from '../../../shared/backend-services/competence-element/competence-element.types';
import { I18nService } from '../../../core/i18n.service';
import { CompetenceSetRepository } from '../../../shared/backend-services/competence-set/competence-set.repository';
import { CompetenceSetSearchResult } from '../../../shared/backend-services/competence-set/competence-set.types';
import { DEFAULT_PAGE_SIZE } from 'src/app/shared/backend-services/request-util';
import { getTranslatedString } from '../../shared/shared-competence-catalog.types';

@Component({
  selector: 'alv-competence-set-search-modal',
  templateUrl: './competence-set-search-modal.component.html',
  styleUrls: ['./competence-set-search-modal.component.scss']
})
export class CompetenceSetSearchModalComponent implements OnInit {

  @Input() existingSetIds: string[];

  form: FormGroup;

  searchCompetenceSetsFn = this.searchCompetenceSets.bind(this);

  private currentLang: string;

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder,
              private i18nService: I18nService,
              private competenceSetRepository: CompetenceSetRepository) { }

  ngOnInit() {
    this.form = this.fb.group({
      competenceSet: ['', Validators.required]
    });
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
  }

  submit() {
    this.modal.close(this.form.get('competenceSet').value.payload);
  }

  cancel() {
    this.modal.dismiss();
  }

  itemSelected(item: TypeaheadItem<CompetenceElement>) {
    this.form.get('competenceSet').setValue(item);
  }

  private searchCompetenceSets(term: string): Observable<TypeaheadItem<CompetenceSetSearchResult>[]> {
    return this.competenceSetRepository.search({page: 0, size: DEFAULT_PAGE_SIZE, body: {query: term}}).pipe(
      map(competenceSetPage => competenceSetPage
        .content
        .filter(item => this.existingSetIds ? !this.existingSetIds.includes(item.id) : true)
        .map(this.mapToItem.bind(this)))
    );
  }

  private mapToItem(competenceSet: CompetenceSetSearchResult, index: number): TypeaheadItem<CompetenceSetSearchResult> {
    return new TypeaheadItem<CompetenceSetSearchResult>(
      'COMPETENCE_SET',
      competenceSet,
      getTranslatedString(competenceSet.knowHow.description, this.currentLang).value,
      index
    );
  }
}
