import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceElementFilterValues } from '../../shared/shared-competence-catalog.types';
import { ElementType } from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.types';
import {
  FilterByStatusesFormValue,
  filterByStatusesFormValueToFlagsMapper
} from '../../shared/filter-by-statuses-form/filter-by-statuses-form.component';

interface CompetenceElementsFilterModalFormValue {
  elementTypes: {
    [index in ElementType]: boolean;
  };
  statusFilters?: FilterByStatusesFormValue;
}


@Component({
  selector: 'alv-competence-elements-filter-modal',
  templateUrl: './competence-elements-filter-modal.component.html',
  styleUrls: ['./competence-elements-filter-modal.component.scss']
})
export class CompetenceElementsFilterModalComponent implements OnInit {

  @Input() currentFiltering: CompetenceElementFilterValues;

  form: FormGroup;

  elementTypes = Object.values(ElementType);

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      elementTypes: this.fb.group(this.createControlsConfig())
    });
  }

  filter() {
    const formValue: CompetenceElementsFilterModalFormValue = this.form.value;
    let result: CompetenceElementFilterValues = {
      types: this.elementTypes.reduce((prev, curr) => {
        if (formValue.elementTypes[curr]) {
          prev.push(curr);
        }
        return prev;
      }, []),
    };
    result = { ...result, ...filterByStatusesFormValueToFlagsMapper(formValue.statusFilters) }
    this.activeModal.close(result);
  }

  cancel() {
    this.activeModal.dismiss();
  }

  private createControlsConfig(): { [key: string]: any } {
    return this.elementTypes.reduce((prev, curr) => {
      prev[curr] = [this.currentFiltering.types.includes(curr)];
      return prev;
    }, {});
  }
}
