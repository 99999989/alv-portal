import { Component, Input } from '@angular/core';
import { AlertComponent } from '../alert.component';
import { NotificationType } from '../../notification.model';

@Component({
  selector: 'alv-chisco-alert',
  templateUrl: './chisco-alert.component.html',
})
export class ChiscoAlertComponent extends AlertComponent {

  defaultNotification = {
    type: NotificationType.INFO,
    isSticky: true
  };

  @Input()
  isShown = true;
  @Input()
  infoText: string;

  constructor() {
    super();
  }

  hide() {
    this.isShown = false;
  }

}
