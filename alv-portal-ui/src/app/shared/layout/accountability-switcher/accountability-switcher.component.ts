import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectableOption } from '../../forms/input/selectable-option.model';
import { FormBuilder, FormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import {
  CoreState,
  getAccountabilities,
  getCurrentAccountability
} from '../../../core/state-management/state/core.state.ts';
import { filter, map } from 'rxjs/operators';
import { Accountability } from '../../backend-services/user-info/user-info.types';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { AccountabilitySelectedAction } from '../../../core/state-management/actions/core.actions';


function mapAccountabilityToSelectOption(accountability: Accountability): SelectableOption<Accountability> {
  console.log({
    label: accountability.companyName,
    value: accountability.companyId,
    payload: accountability.companyId
  });
  return {
    label: accountability.companyName,
    value: accountability.companyId,
    payload: accountability
  };
}

@Component({
  selector: 'alv-accountability-switcher',
  templateUrl: './accountability-switcher.component.html',
  styleUrls: ['./accountability-switcher.component.scss']
})
export class AccountabilitySwitcherComponent extends AbstractSubscriber implements OnInit {

  accountabilityOptions$: Observable<SelectableOption[]>;
  accontabilityFormControl: FormControl;

  constructor(private fb: FormBuilder,
              private store: Store<CoreState>) {
    super();
  }


  ngOnInit() {
    this.accontabilityFormControl = this.fb.control(null);

    this.accountabilityOptions$ = this.store.pipe(
      select(getAccountabilities),
      filter(Boolean),
      map((accountabilities: Accountability[]) => accountabilities.map(mapAccountabilityToSelectOption))
    );

    this.store.pipe(
      select(getCurrentAccountability),
      filter(Boolean),
      map(mapAccountabilityToSelectOption)
    ).subscribe(currentOption => {
      console.log('patching with', currentOption);
      return this.accontabilityFormControl.setValue(currentOption.value);
    });

    this.accontabilityFormControl.valueChanges.subscribe((selectedOption: SelectableOption) => {
      console.log(selectedOption);
      this.store.dispatch(new AccountabilitySelectedAction({
        accountability: selectedOption.payload
      }));
    });
  }

}
