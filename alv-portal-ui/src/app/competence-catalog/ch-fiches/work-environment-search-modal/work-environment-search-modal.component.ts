import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { I18nService } from '../../../core/i18n.service';
import { Observable } from 'rxjs';
import { WorkEnvironmentRepository } from '../../../shared/backend-services/competence-catalog/work-environment/work-environment-repository.service';
import { DEFAULT_PAGE_SIZE } from '../../../shared/backend-services/request-util';
import {
  WorkEnvironment,
  WorkEnvironmentType
} from '../../../shared/backend-services/competence-catalog/work-environment/work-environment.types';
import { TypeaheadItem } from '../../../shared/forms/input/typeahead/typeahead-item';
import { DEFAULT_SORT_OPTIONS } from '../../shared/constants';
import { getTranslatedString } from '../../shared/shared-competence-catalog.types';


@Component({
  selector: 'alv-work-environment-search-modal',
  templateUrl: './work-environment-search-modal.component.html',
  styleUrls: ['./work-environment-search-modal.component.scss']
})
export class WorkEnvironmentSearchModalComponent implements OnInit {

  form: FormGroup;

  searchWorkEnvironmentsFn = this.search.bind(this);
  existingWorkEnvironmentIds: string[];
  workEnvironmentType: WorkEnvironmentType;
  private currentLang: string;

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder,
              private i18nService: I18nService,
              private workEnvironmentRepository: WorkEnvironmentRepository) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      workEnvironment: ['', [
        Validators.required,
      ],
      ]
    });
    this.i18nService.currentLanguage$.pipe(take(1))
      .subscribe(lang => this.currentLang = lang);
  }

  submit() {
    this.modal.close((<TypeaheadItem<WorkEnvironment>>this.form.get('workEnvironment').value).payload);
  }

  cancel() {
    this.modal.dismiss();
  }

  search(query: string): Observable<TypeaheadItem<WorkEnvironment>[]> {
    return this.workEnvironmentRepository.search({
      body: {
        query: query,
        types: [this.workEnvironmentType]
      },
      page: 0,
      sort: DEFAULT_SORT_OPTIONS.ALPHA_ASC,
      size: DEFAULT_PAGE_SIZE
    }).pipe(map((page) => page
      .content
      .filter(item => this.existingWorkEnvironmentIds ? !this.existingWorkEnvironmentIds.includes(item.id) : true)
      .map(this.mapToItem.bind(this))));
  }

  mapToItem(workEnvironment: WorkEnvironment): TypeaheadItem<WorkEnvironment> {
    return new TypeaheadItem<WorkEnvironment>('WORK_ENVIRONMENTS',
      workEnvironment,
      getTranslatedString(workEnvironment.description, this.currentLang).value + ' (' + workEnvironment.id + ')',
    );
  }

}
