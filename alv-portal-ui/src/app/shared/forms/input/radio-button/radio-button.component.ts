import { Component, Host, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SelectableOption } from '../selectable-option.model';
import { InputType } from '../input-type.enum';
import { AbstractSelectableInput } from '../abstract-selectable-input';
import { InputIdGenerationService } from '../input-id-generation.service';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'alv-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['../abstract-checkbox-radio.scss', './radio-button.component.scss']
})
export class RadioButtonComponent extends AbstractSelectableInput implements OnInit {

  @Input()
  name: string;


  @Input()
  radioButtonClass: string;

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
              inputIdGenerationService: InputIdGenerationService) {
    super(controlContainer, InputType.RADIO_BUTTON, inputIdGenerationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.options$ = this.options$ || this.getDefaultOptions();
    this.name = this.name || this.id;
  }

  private getDefaultOptions(): Observable<Array<SelectableOption>> {
    return of([
      {
        label: 'Yes',
        value: true
      },
      {
        label: 'No',
        value: false
      }
    ]);
  }

}
