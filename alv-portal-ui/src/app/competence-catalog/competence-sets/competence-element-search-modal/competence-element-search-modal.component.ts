import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TypeaheadItem } from '../../../shared/forms/input/typeahead/typeahead-item';
import { map, take } from 'rxjs/operators';
import {
  CompetenceElement,
  ElementType
} from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.types';
import { CompetenceElementRepository } from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.repository';
import { I18nService } from '../../../core/i18n.service';
import { DEFAULT_PAGE_SIZE } from '../../../shared/backend-services/request-util';
import { getTranslatedString } from '../../shared/shared-competence-catalog.types';

@Component({
  selector: 'alv-competence-element-search-modal',
  templateUrl: './competence-element-search-modal.component.html',
  styleUrls: ['./competence-element-search-modal.component.scss']
})
export class CompetenceElementSearchModalComponent implements OnInit {

  @Input() elementType: ElementType;

  @Input() existingElementIds: string[];

  form: FormGroup;

  searchCompetenceElementsFn = this.searchCompetenceElements.bind(this);

  private currentLang: string;

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder,
              private i18nService: I18nService,
              private competenceElementRepository: CompetenceElementRepository) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      competenceElement: ['', Validators.required],
      description: this.fb.group({
        de: [''],
        fr: [''],
        it: [''],
        en: ['']
      })
    });
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
  }

  submit() {
    this.modal.close(this.form.get('competenceElement').value.payload);
  }

  cancel() {
    this.modal.dismiss();
  }

  itemSelected(item: TypeaheadItem<CompetenceElement>) {
    this.form.get('competenceElement').setValue(item);
    this.form.get('description').patchValue(item.payload.description);
  }

  private searchCompetenceElements(term: string): Observable<TypeaheadItem<CompetenceElement>[]> {
    return this.competenceElementRepository.search({
      page: 0,
      size: DEFAULT_PAGE_SIZE,
      body: { query: term, types: [this.elementType] }
    }).pipe(
      map(competenceElementPage => competenceElementPage
        .content
        .filter(item => this.existingElementIds ? !this.existingElementIds.includes(item.id) : true)
        .map(this.mapToItem.bind(this)))
    );
  }

  private mapToItem(competenceElement: CompetenceElement, index: number): TypeaheadItem<CompetenceElement> {
    return new TypeaheadItem<CompetenceElement>(
      competenceElement.type,
      competenceElement,
      getTranslatedString(competenceElement.description, this.currentLang).value,
      index
    );
  }
}
