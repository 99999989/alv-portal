import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { I18nService } from '../../../core/i18n.service';
import { Observable } from 'rxjs';
import { PrerequisiteRepository } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite-repository.service';
import { DEFAULT_PAGE_SIZE } from '../../../shared/backend-services/request-util';
import { Prerequisite } from '../../../shared/backend-services/competence-catalog/prerequisite/prerequisite.types';
import { TypeaheadItem } from '../../../shared/forms/input/typeahead/typeahead-item';
import { DEFAULT_SORT_OPTIONS } from '../../shared/constants';
import { getTranslatedString } from '../../shared/shared-competence-catalog.types';


@Component({
  selector: 'alv-prerequisite-search-modal',
  templateUrl: './prerequisite-search-modal.component.html',
  styleUrls: ['./prerequisite-search-modal.component.scss']
})
export class PrerequisiteSearchModalComponent implements OnInit {

  form: FormGroup;

  searchPrerequisitesFn = this.search.bind(this);
  existingPrerequisiteIds: string[];
  private currentLang: string;

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder,
              private i18nService: I18nService,
              private prerequisiteRepository: PrerequisiteRepository) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      prerequisite: ['', [
        Validators.required,
      ],
      ]
    });
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
  }

  submit() {
    this.modal.close((<TypeaheadItem<Prerequisite>>this.form.get('prerequisite').value).payload);
  }

  cancel() {
    this.modal.dismiss();
  }

  search(query: string): Observable<TypeaheadItem<Prerequisite>[]> {
    return this.prerequisiteRepository.search({
      body: {
        query: query
      },
      page: 0,
      sort: DEFAULT_SORT_OPTIONS.ALPHA_ASC,
      size: DEFAULT_PAGE_SIZE
    }).pipe(map((page) => page
      .content
      .filter(item => this.existingPrerequisiteIds ? !this.existingPrerequisiteIds.includes(item.id) : true)
      .map(this.mapToItem.bind(this))));
  }

  mapToItem(prerequisite: Prerequisite): TypeaheadItem<Prerequisite> {
    return new TypeaheadItem<Prerequisite>('PREREQUISITE',
      prerequisite,
      getTranslatedString(prerequisite.description, this.currentLang).value + ' (' + prerequisite.id + ')',
    );
  }

}
