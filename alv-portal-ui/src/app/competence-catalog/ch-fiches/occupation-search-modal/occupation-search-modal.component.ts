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
import { ChFicheRepository } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.repository';
import { OccupationTypeaheadItem } from '../../../shared/occupations/occupation-typeahead-item';


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
    console.log('submit')
    this.modal.close(this.form.get('occupation').value);
  }

  cancel() {
    this.modal.dismiss();
  }

  searchOccupations(query: string): Observable<OccupationTypeaheadItem[]> {
    return this.occupationSuggestionService.fetchCompetenceCatalogOccupations(query);
  }

  //
  // isUsedLocallyValidator(occupation: OccupationTypeaheadItem): boolean {
  //   return false;
  // }

  isUsedGloballyAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    // console.log(bfsOccupation);

    return this.chFicheRepository.findByBfsCode((<OccupationTypeaheadItem>control.value).payload.value).pipe(
      map(chFiches => {
        console.log(chFiches.length ? { isUsedInFiche: chFiches[0] } : null);
        return chFiches.length ? { isUsedInFiche: chFiches[0] } : null;
      }),
      take(1)
    );
  }

  getErrorMessage(formInputName: string) {
    return JSON.stringify(this.form.get(formInputName).errors);
  }
}
