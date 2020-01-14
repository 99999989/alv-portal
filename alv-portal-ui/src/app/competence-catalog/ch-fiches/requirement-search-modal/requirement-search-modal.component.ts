import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { I18nService } from '../../../core/i18n.service';
import { Observable } from 'rxjs';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { RequirementRepository } from '../../../shared/backend-services/competence-catalog/requirement/requirement.repository';
import { DEFAULT_PAGE_SIZE } from '../../../shared/backend-services/request-util';
import { Requirement } from '../../../shared/backend-services/competence-catalog/requirement/requirement.types';
import { TypeaheadItem } from '../../../shared/forms/input/typeahead/typeahead-item';
import { DEFAULT_SORT_OPTIONS } from '../../shared/constants';
import { getTranslatedString } from '../../shared/shared-competence-catalog.types';


@Component({
  selector: 'alv-requirement-search-modal',
  templateUrl: './requirement-search-modal.component.html',
  styleUrls: ['./requirement-search-modal.component.scss']
})
export class RequirementSearchModalComponent implements OnInit {

  @Input() existingOccupations: string[];

  form: FormGroup;

  searchRequirementsFn = this.search.bind(this);
  existingRequirementIds: string[];
  private currentLang: string;

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder,
              private i18nService: I18nService,
              private requirementRepository: RequirementRepository,
              private chFicheRepository: ChFicheRepository) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      requirement: ['', [
        Validators.required,
      ],
      ]
    });
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
  }

  submit() {
    this.modal.close((<TypeaheadItem<Requirement>>this.form.get('requirement').value).payload);
  }

  cancel() {
    this.modal.dismiss();
  }

  search(query: string): Observable<TypeaheadItem<Requirement>[]> {
    return this.requirementRepository.search({
      body: {
        query: query
      },
      page: 0,
      sort: DEFAULT_SORT_OPTIONS.ALPHA_ASC,
      size: DEFAULT_PAGE_SIZE
    }).pipe(map((page) => page
      .content
      .filter(item => this.existingRequirementIds ? !this.existingRequirementIds.includes(item.id) : true)
      .map(this.mapToItem.bind(this))));
  }

  mapToItem(requirement: Requirement): TypeaheadItem<Requirement> {
    return new TypeaheadItem<Requirement>('REQUIREMENT',
      requirement,
      getTranslatedString(requirement.description, this.currentLang).value + ' (' + requirement.id + ')',
    );
  }

}
