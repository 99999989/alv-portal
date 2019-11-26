import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { I18nService } from '../../../core/i18n.service';
import { Observable } from 'rxjs';
import { OccupationSuggestionService } from '../../../shared/occupations/occupation-suggestion.service';
import { OccupationTypes } from '../../../shared/backend-services/reference-service/occupation-label.repository';
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { OccupationTypeaheadItem } from '../../../shared/occupations/occupation-typeahead-item';
import { JobSearchRequestMapper } from '../../../job-advertisement/job-ad-search/state-management/effects';


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
              private occupationSuggestionService: OccupationSuggestionService,
              private chFicheRepository: ChFicheRepository) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      occupation: ['', [
        Validators.required,
      ],
        [
          this.isUsedGloballyAsyncValidator.bind(this)
        ]
      ]
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
    return this.occupationSuggestionService.fetchCompetenceCatalogOccupations(query, [OccupationTypes.BFS]);
  }

  isUsedGloballyAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.chFicheRepository.search({
      page: 0,
      size: 1,
      body: {
        occupationCodes: JobSearchRequestMapper.mapProfessionCodes([<OccupationTypeaheadItem>control.value]),
      }
    }).pipe(
      map(pageOfFiches => {
        return pageOfFiches.content.length ? { isUsedInFiche: pageOfFiches.content[0] } : null;
      })
    );
  }


}
