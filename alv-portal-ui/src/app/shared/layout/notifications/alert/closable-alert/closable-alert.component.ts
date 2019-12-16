import { Component, Input } from '@angular/core';
import { AlertComponent } from '../alert.component';

@Component({
  selector: 'alv-closable-alert',
  templateUrl: './closable-alert.component.html',
})
export class ClosableAlertComponent extends AlertComponent {

  @Input()
  isShown = true;

  constructor() {
    super();
  }

  hide() {
    this.isShown = false;
  }

}
