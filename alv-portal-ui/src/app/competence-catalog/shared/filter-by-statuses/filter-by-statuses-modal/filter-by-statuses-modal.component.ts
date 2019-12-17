import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterByStatusesFormValue } from '../filter-by-statuses-form/filter-by-statuses-form.component';
import {
  CommonFilters,
  CompetenceElementFilterValues
} from '../../shared-competence-catalog.types';
import {
  filterByStatusesFormValueToFlagsMapper,
  flagsToFilterByStatusesFormValueMapper
} from '../filter-by-statuses-mapper';

export interface CompetenceSetFilterFormValue {
  statusFilters?: FilterByStatusesFormValue;
}


@Component({
  selector: 'alv-filter-by-statuses-modal',
  templateUrl: './filter-by-statuses-modal.component.html',
  styleUrls: ['./filter-by-statuses-modal.component.scss']
})
export class FilterByStatusesModalComponent implements OnInit, AfterViewInit {

  @Input() currentFiltering: CompetenceElementFilterValues;

  form: FormGroup;

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  filter() {
    const formValue: CompetenceSetFilterFormValue = this.form.value;
    const result: CommonFilters = filterByStatusesFormValueToFlagsMapper(formValue.statusFilters);
    this.activeModal.close(result);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  ngAfterViewInit() {
    this.form.get('statusFilters').patchValue(flagsToFilterByStatusesFormValueMapper(this.currentFiltering));
  }

  ngOnInit() {
    this.form = this.fb.group({});
  }

}
