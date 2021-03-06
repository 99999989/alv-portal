import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationStep } from '../../../registration-step.enum';
import { AbstractRegistrationStep } from '../../../abstract-registration-step';
import { pavSteps } from '../pav-steps.config';
import { RegistrationRepository } from '../../../../shared/backend-services/registration/registration.repository';
import { PavSuggestion } from '../../../../shared/backend-services/pav-search/pav-search.types';
import { PavSearchRepository } from '../../../../shared/backend-services/pav-search/pav-search.repository';
import { TypeaheadItem } from '../../../../shared/forms/input/typeahead/typeahead-item';

@Component({
  selector: 'alv-pav-identification',
  templateUrl: './pav-identification.component.html',
  styleUrls: ['./pav-identification.component.scss']
})
export class PavIdentificationComponent extends AbstractRegistrationStep implements OnInit {

  @Output() pavSelected = new EventEmitter<PavSuggestion>();

  pavSteps = pavSteps;

  pavForm: FormGroup;

  searchOrganizationsFn = this.searchOrganizations.bind(this);

  constructor(private pavSearchRepository: PavSearchRepository,
              private registrationRepository: RegistrationRepository,
              private fb: FormBuilder,
              private router: Router) {
    super();
  }

  ngOnInit() {
    this.pavForm = this.fb.group({
      organization: ['', Validators.required]
    });
  }

  itemSelected(item: TypeaheadItem<PavSuggestion>) {
    this.pavSelected.emit(item.payload);
  }

  goToRequestAccessCodeStep() {
    this.updateStep.emit(RegistrationStep.PAV_REQUEST_ACCESS_STEP);
  }

  returnToRoleSelection() {
    this.updateStep.emit(RegistrationStep.SELECT_ROLE_STEP);
  }

  returnToHome() {
    this.router.navigate(['home']);
  }

  private searchOrganizations(term: string): Observable<TypeaheadItem<PavSuggestion>[]> {
    return this.pavSearchRepository.suggest(term).pipe(
      mergeMap(organizations => from(organizations)),
      map(this.mapToItem),
      toArray()
    );
  }

  private mapToItem(pavSuggestion: PavSuggestion, index: number): TypeaheadItem<PavSuggestion> {
    return new TypeaheadItem<PavSuggestion>(
      'pav',
      pavSuggestion,
      PavSearchRepository.formatOrganizationName(pavSuggestion),
      index
    );
  }

}
