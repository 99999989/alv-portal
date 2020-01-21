import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterByStatusesFormValue, } from '../../shared/filter-by-statuses/filter-by-statuses-form/filter-by-statuses-form.component';
import {
  filterByStatusesFormValueToFlagsMapper,
  flagsToFilterByStatusesFormValueMapper
} from '../../shared/filter-by-statuses/filter-by-statuses-mapper';
import { CompetenceCatalogEditorAwareComponent } from '../../shared/competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { WorkEnvironmentFilterValues } from '../../shared/shared-competence-catalog.types';
import { WorkEnvironmentType } from '../../../shared/backend-services/competence-catalog/work-environment/work-environment.types';

interface WorkEnvironmentsFilterModalFormValue {
  workEnvironmentTypes: {};
  statusFilters?: FilterByStatusesFormValue;
}


@Component({
  selector: 'alv-work-environment-filter-modal',
  templateUrl: './work-environment-filter-modal.component.html',
  styleUrls: ['./work-environment-filter-modal.component.scss']
})
export class WorkEnvironmentsFilterModalComponent extends CompetenceCatalogEditorAwareComponent implements OnInit, AfterViewInit {
  @Input() currentFiltering: WorkEnvironmentFilterValues;
  form: FormGroup;
  workEnvironmentTypes = Object.values(WorkEnvironmentType);


  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal,
              protected authenticationService: AuthenticationService) {
    super(authenticationService);
  }

  ngAfterViewInit() {
    const statusFiltersForm = this.form.get('statusFilters');
    if (statusFiltersForm) {
      statusFiltersForm.patchValue(flagsToFilterByStatusesFormValueMapper(this.currentFiltering));
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.form = this.fb.group({
      workEnvironmentTypes: this.fb.group(this.createControlsConfig())
    });
  }


  filter() {
    const formValue: WorkEnvironmentsFilterModalFormValue = this.form.value;
    let result: WorkEnvironmentFilterValues = {
      types: mapFormValueToWorkEnvironmentTypeFilters(formValue, this.workEnvironmentTypes)
    };
    if (formValue && formValue.hasOwnProperty('statusFilters')) {
      result = { ...result, ...filterByStatusesFormValueToFlagsMapper(formValue.statusFilters) };
    }
    this.activeModal.close(result);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  private createControlsConfig(): { [key: string]: any } {
    return this.workEnvironmentTypes.reduce((prev, curr) => {
      prev[curr] = [this.currentFiltering.types.includes(curr)];
      return prev;
    }, {});
  }
}

function mapFormValueToWorkEnvironmentTypeFilters(formValue: WorkEnvironmentsFilterModalFormValue, possibleWorkEnvironmentTypes: WorkEnvironmentType[]): WorkEnvironmentType[] {
  const res = possibleWorkEnvironmentTypes.filter((possibleElementType) => formValue.workEnvironmentTypes[possibleElementType]);
  return res.length ? res : possibleWorkEnvironmentTypes;
}
