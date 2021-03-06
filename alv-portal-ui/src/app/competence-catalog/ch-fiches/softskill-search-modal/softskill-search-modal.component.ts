import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { I18nService } from '../../../core/i18n.service';
import { Observable } from 'rxjs';
import { SoftskillRepository } from '../../../shared/backend-services/competence-catalog/softskill/softskill-repository.service';
import { DEFAULT_PAGE_SIZE } from '../../../shared/backend-services/request-util';
import { Softskill } from '../../../shared/backend-services/competence-catalog/softskill/softskill.types';
import { TypeaheadItem } from '../../../shared/forms/input/typeahead/typeahead-item';
import { DEFAULT_SORT_OPTIONS } from '../../shared/constants';
import { getTranslatedString } from '../../shared/shared-competence-catalog.types';


@Component({
  selector: 'alv-softskill-search-modal',
  templateUrl: './softskill-search-modal.component.html',
  styleUrls: ['./softskill-search-modal.component.scss']
})
export class SoftskillSearchModalComponent implements OnInit {

  form: FormGroup;

  searchSoftskillsFn = this.search.bind(this);
  existingSoftskillIds: string[];
  private currentLang: string;

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder,
              private i18nService: I18nService,
              private softskillRepository: SoftskillRepository) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      softskill: ['', [
        Validators.required,
      ],
      ]
    });
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
  }

  submit() {
    this.modal.close((<TypeaheadItem<Softskill>>this.form.get('softskill').value).payload);
  }

  cancel() {
    this.modal.dismiss();
  }

  search(query: string): Observable<TypeaheadItem<Softskill>[]> {
    return this.softskillRepository.search({
      body: {
        query: query
      },
      page: 0,
      sort: DEFAULT_SORT_OPTIONS.ALPHA_ASC,
      size: DEFAULT_PAGE_SIZE
    }).pipe(map((page) => page
      .content
      .filter(item => this.existingSoftskillIds ? !this.existingSoftskillIds.includes(item.id) : true)
      .map(this.mapToItem.bind(this))));
  }

  mapToItem(softskill: Softskill): TypeaheadItem<Softskill> {
    return new TypeaheadItem<Softskill>('SOFTSKILL',
      softskill,
      getTranslatedString(softskill.description, this.currentLang).value + ' (' + softskill.id + ')',
    );
  }

}
