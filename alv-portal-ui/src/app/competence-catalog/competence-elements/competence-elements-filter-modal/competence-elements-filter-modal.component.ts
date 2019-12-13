import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceElementFilterValues } from '../../shared/shared-competence-catalog.types';
import { ElementType } from '../../../shared/backend-services/competence-catalog/competence-element/competence-element.types';
import { FilterByStatusesFormValue, } from '../../shared/filter-by-statuses/filter-by-statuses-form/filter-by-statuses-form.component';
import {
  filterByStatusesFormValueToFlagsMapper,
  flagsToFilterByStatusesFormValueMapper
} from '../../shared/filter-by-statuses/filter-by-statuses-mapper';

interface CompetenceElementsFilterModalFormValue {
  elementTypes: {
    [index in ElementType]: boolean;
  };
  statusFilters?: FilterByStatusesFormValue;
}


function mapFormValueToFilters(formValue: CompetenceElementsFilterModalFormValue, possibleElementTypes: ElementType[]): ElementType[] {
  const res = possibleElementTypes.filter((possibleElementType) => formValue.elementTypes[possibleElementType]);
  return res.length ? res : possibleElementTypes;
}

@Component({
  selector: 'alv-competence-elements-filter-modal',
  templateUrl: './competence-elements-filter-modal.component.html',
  styleUrls: ['./competence-elements-filter-modal.component.scss']
})
export class CompetenceElementsFilterModalComponent implements OnInit, AfterViewInit {
  @Input() currentFiltering: CompetenceElementFilterValues;
  form: FormGroup;
  elementTypes = Object.values(ElementType);

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  ngAfterViewInit() {
    this.form.get('statusFilters').patchValue(flagsToFilterByStatusesFormValueMapper(this.currentFiltering));
  }

  ngOnInit() {
    this.form = this.fb.group({
      elementTypes: this.fb.group(this.createControlsConfig())
    });
  }


  filter() {
    const formValue: CompetenceElementsFilterModalFormValue = this.form.value;
    let result: CompetenceElementFilterValues = {
      types: mapFormValueToFilters(formValue, this.elementTypes),
    };
    result = { ...result, ...filterByStatusesFormValueToFlagsMapper(formValue.statusFilters) };
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
