import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectableOption } from '../../../../shared/forms/input/selectable-option.model';
import {
  WorkEffortApplyStatus
} from '../../../../shared/backend-services/work-efforts/proof-of-work-efforts.types';
import {
  WorkEffortsControlPeriodFilter,
  WorkEffortsFilterValues
} from '../work-efforts-overview-filter.types';

@Component({
  selector: 'alv-work-efforts-filter-modal',
  templateUrl: './work-efforts-filter-modal.component.html',
  styleUrls: ['./work-efforts-filter-modal.component.scss']
})
export class WorkEffortsFilterModalComponent implements OnInit {

  form: FormGroup;

  currentFiltering: WorkEffortsFilterValues;

  controlPeriodOptions$: Observable<SelectableOption[]>;

  applyStatusOptions$: Observable<SelectableOption[]>;

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      controlPeriod: [this.currentFiltering.controlPeriod],
      applyStatus: [this.currentFiltering.applyStatus]
    });

    this.controlPeriodOptions$ = of(Object.values(WorkEffortsControlPeriodFilter)
      .map(s => ({
        label: 'portal.work-efforts.filter.control-period.' + s,
        value: s
      }))
    );

    this.applyStatusOptions$ = of(Object.values(WorkEffortApplyStatus)
      .map(s => ({
        label: 'portal.work-efforts.apply-status.' + s,
        value: s
      }))
    );
  }

  filter() {
    const result: WorkEffortsFilterValues = {
      controlPeriod: this.form.controls['controlPeriod'].value,
      applyStatus: this.form.controls['applyStatus'].value
    };
    this.activeModal.close(result);
  }

  cancel() {
    this.activeModal.dismiss();
  }
}
