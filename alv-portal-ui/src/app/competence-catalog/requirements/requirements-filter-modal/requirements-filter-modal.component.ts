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
import { CommonFilters } from '../../shared/shared-competence-catalog.types';

interface RequirementsFilterModalFormValue {
  elementTypes: {};
  statusFilters?: FilterByStatusesFormValue;
}


@Component({
  selector: 'alv-requirements-filter-modal',
  templateUrl: './requirements-filter-modal.component.html',
  styleUrls: ['./requirements-filter-modal.component.scss']
})
export class RequirementsFilterModalComponent extends CompetenceCatalogEditorAwareComponent implements OnInit, AfterViewInit {
  @Input() currentFiltering: CommonFilters;
  form: FormGroup;

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
      elementTypes: this.fb.group(this.createControlsConfig())
    });
  }


  filter() {
    const formValue: RequirementsFilterModalFormValue = this.form.value;
    let result: CommonFilters = {};
    if (formValue && formValue.hasOwnProperty('statusFilters')) {
      result = { ...result, ...filterByStatusesFormValueToFlagsMapper(formValue.statusFilters) };
    }
    this.activeModal.close(result);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  private createControlsConfig(): { [key: string]: any } {
    return {}; // fixme
  }
}
