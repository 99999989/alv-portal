import { Component, EventEmitter, Input, Output } from '@angular/core';
import { collapseExpandAnimation } from '../../animations/animations';
import { Notification, NotificationType } from '../notifications/notification.model';
// Angular animations have problems with animating the transition between display:none and display:block, so we couldn't
// implement the animation the simple way. Instead, the following hack was used:
// 1. We only collapse to 1 px, so that no optimizer can remove the panel content from the DOM
// 2. We use overflow:hidden on a .panel-content container so that when it shrinks, the elements inside are not shown - in css
// 3.We use min-height: 0 on a .panel-content container to allow schrinking on IE - in css
// 3. the rest is done in animations below. We purposefully remove paddings on collapsed, because otherwise the top of the first
// element will be visible inside the closed panel.
// If you think that you find simpler way to collapsing, please test it thoroughly with IE and Safari.
@Component({
  selector: 'alv-collapse-notification',
  templateUrl: './collapse-notification.component.html',
  styleUrls: ['./collapse-notification.component.scss'],
  animations: [collapseExpandAnimation]
})
export class CollapseNotificationComponent {

  notificationClass = 'empty';

  @Input()
  set notification(value: Notification) {
    this._notification = value;
    this.setNotificationClasses();
  }

  get notification(): Notification {
    return this._notification;
  }

  decorateClass: ClassDecoration = {};

  icon = '';

  private _notification: Notification;

  @Input() panelId: string;

  @Input() panelTitle: string;

  @Input()
  isCollapsed = false;

  @Output()
  collapsed = new EventEmitter<boolean>(); // true if isCollapsed===true

  @Input()
  isAlwaysExpanded = false;

  constructor() {
    this.decorateClass[NotificationType.ERROR] = {
      icon: 'ban',
      background: 'error'
    };
    this.decorateClass[NotificationType.INFO] = {
      icon: 'info',
      background: 'info'
    };
    this.decorateClass[NotificationType.SUCCESS] = {
      icon: 'check',
      background: 'success'
    };
    this.decorateClass[NotificationType.WARNING] = {
      icon: 'exclamation',
      background: 'warning'
    };
  }

  toggle() {
    this.isCollapsed ? this.expand() : this.collapse();
  }

  expand() {
    this.isCollapsed = false;
    this.emitCollapseEvent();
  }

  collapse() {
    this.isCollapsed = true;
    this.emitCollapseEvent();
  }

  private emitCollapseEvent() {
    this.collapsed.emit(this.isCollapsed);
  }

  private setNotificationClasses() {
    this.icon = this.decorateClass[this._notification.type].icon;
    this.notificationClass = this.decorateClass[this._notification.type].background;
  }
}

interface ClassDecoration {
  [s: number]: {
    icon: string;
    background: string;
  };
}

