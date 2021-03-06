import { Component, OnInit } from '@angular/core';
import { AbstractSubscriber } from '../../core/abstract-subscriber';
import { Subject } from 'rxjs';
import {
  empty,
  SystemNotificationDto
} from '../../shared/backend-services/system-notifications/system-notification.types';
import { SystemNotificationRepository } from '../../shared/backend-services/system-notifications/system-notification-repository';
import { ModalService } from '../../shared/layout/modal/modal.service';
import { SystemNotificationModalComponent } from './modal/system-notification-modal.component';
import { NotificationsService } from '../../core/notifications.service';
import { ConfirmModalConfig } from '../../shared/layout/modal/confirm-modal/confirm-modal-config.model';
import { SHORT_DATE_TIME_FORMAT } from '../../shared/pipes/locale-aware-date.pipe';

@Component({
  selector: 'alv-system-notifications',
  templateUrl: './system-notifications.component.html',
})
export class SystemNotificationsComponent extends AbstractSubscriber implements OnInit {

  systemNotifications$ = new Subject<SystemNotificationDto[]>();
  SHORT_DATE_TIME_FORMAT = SHORT_DATE_TIME_FORMAT;
  tableHeaders = [
    'portal.admin.system-notifications.title',
    'portal.admin.system-notifications.type',
    'portal.admin.system-notifications.startDate',
    'portal.admin.system-notifications.endDate',
    'portal.admin.system-notifications.status',
    'portal.admin.system-notifications.actions',
  ];

  constructor(private systemNotificationRepository: SystemNotificationRepository,
              private modalService: ModalService,
              private notificationsService: NotificationsService) {
    super();
  }

  ngOnInit(): void {
    this.loadSystemNotifications();
  }

  openCreateModal() {
    const createModalRef = this.modalService.openLarge(SystemNotificationModalComponent);
    const createModalComponent = <SystemNotificationModalComponent>createModalRef.componentInstance;
    createModalComponent.systemNotification = empty();
    createModalComponent.title = 'portal.admin.system-notifications.create.modal.title';
    createModalRef.result
      .then(() => {
        this.loadSystemNotifications();
        this.notificationsService.success('portal.admin.system-notifications.notifications.create.success', false);
      })
      .catch(() => {
      });
  }

  openEditModal(systemNotification: SystemNotificationDto) {
    const modalRef = this.modalService.openLarge(SystemNotificationModalComponent);
    const editModalComponent = <SystemNotificationModalComponent>modalRef.componentInstance;
    editModalComponent.systemNotification = systemNotification;
    editModalComponent.title = 'portal.admin.system-notifications.edit.modal.title';
    modalRef.result
      .then(() => {
        this.loadSystemNotifications();
        this.notificationsService.success('portal.admin.system-notifications.notifications.edit.success', false);
      })
      .catch(() => {
      });
  }

  openDeleteModal(id: string) {
    this.modalService.openConfirm({
      title: 'portal.admin.system-notifications.delete.modal.title',
      content: 'portal.admin.system-notifications.delete.modal.text',
      confirmLabel: 'portal.admin.system-notifications.delete.modal.confirm-dialog.yes',
      cancelLabel: 'portal.admin.system-notifications.delete.modal.confirm-dialog.no'
    } as ConfirmModalConfig).result
      .then(
        () => {
          this.notificationsService.success('portal.admin.system-notifications.notifications.delete.success', false);
          this.systemNotificationRepository.deleteSystemNotification(id)
            .subscribe(() => this.loadSystemNotifications());
        })
      .catch(() => {
      });
  }

  toggleStatus(systemNotification: SystemNotificationDto) {
    const activated = !systemNotification.active;
    const updatedNotification = {
      ...systemNotification,
      active: activated
    };
    this.systemNotificationRepository.updateSystemNotification(updatedNotification)
      .subscribe(() => {
        systemNotification.active = activated;
      });
  }

  private loadSystemNotifications() {
    this.systemNotificationRepository.getAllSystemNotifications()
      .subscribe(value => {
        this.systemNotifications$.next(value);
      });
  }
}
