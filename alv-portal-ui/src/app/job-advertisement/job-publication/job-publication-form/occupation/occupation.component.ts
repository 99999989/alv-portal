import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectableOption } from '../../../../shared/forms/input/selectable-option.model';
import { Observable, of } from 'rxjs';
import {
  Degree,
  Qualification
} from '../../../../shared/backend-services/shared.types';
import { OccupationSuggestionService } from '../../../../shared/occupations/occupation-suggestion.service';
import { OccupationTypeaheadItem } from '../../../../shared/occupations/occupation-typeahead-item';
import { OccupationFormValue } from './occupation-form-value.types';
import { I18nService } from '../../../../core/i18n.service';
import { distinctUntilChanged, filter, flatMap, map, takeUntil } from 'rxjs/operators';
import { AbstractSubscriber } from '../../../../core/abstract-subscriber';
import { JobPublicationFormValueKeys } from '../job-publication-form-value.types';
import { WorkExperience } from '../../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { REFERENCE_SERVICE_API_VERSION } from '../../../../shared/backend-services/reference-service/occupation-label.repository';

@Component({
  selector: 'alv-occupation',
  templateUrl: './occupation.component.html',
  styleUrls: ['./occupation.component.scss']
})
export class OccupationComponent extends AbstractSubscriber implements OnInit {

  @Input()
  parentForm: FormGroup;

  @Input()
  occupationFormValue: OccupationFormValue;

  occupation: FormGroup;

  qualificationOptions$: Observable<SelectableOption[]> = of([
    {
      value: null,
      label: 'home.tools.job-publication.no-selection'
    },
    ...Object.keys(Qualification).map(qualification => {
      return {
        value: qualification,
        label: 'portal.job-ad.qualification.' + qualification
      };
    })
  ]);

  degreeOptions$: Observable<SelectableOption[]> = of([
    {
      value: null,
      label: 'home.tools.job-publication.no-selection'
    },
    ...Object.keys(Degree).map(degree => {
      return {
        value: degree,
        label: 'global.degree.' + degree
      };
    })
  ]);

  experienceOptions$: Observable<SelectableOption[]> = of([
    {
      value: null,
      label: 'home.tools.job-publication.no-selection'
    },
    ...Object.keys(WorkExperience).map(experience => {
      return {
        value: experience,
        label: 'home.tools.job-publication.experience.' + experience
      };
    })
  ]);

  loadOccupationsFn = this.loadOccupations.bind(this);

  constructor(private occupationSuggestionService: OccupationSuggestionService,
              private fb: FormBuilder,
              private i18nService: I18nService) {
    super();
  }

  ngOnInit(): void {
    const { occupationSuggestion, qualification, degree, experience } = this.occupationFormValue;

    this.occupation = this.fb.group({
      occupationSuggestion: [occupationSuggestion, [
        Validators.required
      ]],
      degree: [degree],
      qualification: [qualification],
      experience: [experience]
    });

    this.parentForm.addControl('occupation', this.occupation);
    this.i18nService.currentLanguage$.pipe(
      distinctUntilChanged(),
      filter(() => !!this.occupation.value.occupationSuggestion),
      flatMap(lang => this.occupationSuggestionService.translate(this.occupation.value.occupationSuggestion, lang, REFERENCE_SERVICE_API_VERSION.V_2)),
      map((translatedOccupation) => translatedOccupation.label === '' ? null : translatedOccupation),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(translatedOccupation => {
      this.occupation.get('occupationSuggestion').setValue(translatedOccupation);
    });
    this.parentForm.addControl(JobPublicationFormValueKeys.OCCUPATION, this.occupation);
  }

  private loadOccupations(query: string): Observable<OccupationTypeaheadItem[]> {
    return this.occupationSuggestionService.fetchJobPublicationOccupations(query);
  }
}
