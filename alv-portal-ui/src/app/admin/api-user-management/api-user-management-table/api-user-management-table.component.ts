import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ApiUser, ApiUserColumnDefinition
} from '../../../shared/backend-services/api-user-management/api-user-management.types';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { ApiUserManagementRepository } from '../../../shared/backend-services/api-user-management/api-user-management-repository';
import { FAILURE, mapApiUserColumnDefinitionToSort, prepareApiUserColumns } from '../api-user-management-factory';
import { NotificationsService } from '../../../core/notifications.service';
import { ConfirmModalConfig } from '../../../shared/layout/modal/confirm-modal/confirm-modal-config.model';
import { ApiUserEditModalComponent } from '../api-user-edit-modal/api-user-edit-modal.component';
import { ApiUserPasswordModalComponent } from '../api-user-password-modal/api-user-password-modal.component';

@Component({
  selector: 'alv-api-user-management-table',
  templateUrl: './api-user-management-table.component.html'
})
export class ApiUserManagementTableComponent implements OnInit {

  readonly CONFIRM_CHANGE_STATUS_MODAL: ConfirmModalConfig = {
    title: 'portal.admin.api-user-management.change-status-dialog.title',
    content: 'portal.admin.api-user-management.change-status-dialog.question',
    confirmLabel: 'portal.admin.user-info.confirm-dialog.yes',
    cancelLabel: 'portal.admin.user-info.confirm-dialog.no'
  };

  @Input()
  apiUserList: ApiUser[];

  @Input()
  currentSorting: ApiUserColumnDefinition;

  @Output()
  sort = new EventEmitter<string>();

  @Output()
  scroll = new EventEmitter<void>();

  @Output()
  statusChange = new EventEmitter<void>();

  @Output()
  updateUser = new EventEmitter<ApiUser>();

  @Output()
  updatePassword = new EventEmitter<string>();

  columnDefinitions: ApiUserColumnDefinition[];

  constructor(private modalService: ModalService,
              private notificationService: NotificationsService,
              private apiUserManagementRepository: ApiUserManagementRepository) { }

  ngOnInit() {
    this.columnDefinitions = prepareApiUserColumns();
  }

  onScroll() {
    this.scroll.emit();
  }

  onSort(column: string) {
    this.sort.emit(mapApiUserColumnDefinitionToSort(this.currentSorting, column));
  }

  onStatusChangeDialog(apiUser: ApiUser, active: boolean) {
    const changedUser = {...apiUser, active};
    this.modalService.openConfirm(this.CONFIRM_CHANGE_STATUS_MODAL).result.then(
      () => this.apiUserManagementRepository.toggleStatus(changedUser)
        .subscribe(() => this.statusChange.emit(), () => this.error()),
      () => {}
    );
  }

  onUpdateUserDialog(apiUser: ApiUser) {
    const apiUserModalRef = this.modalService.openLarge(ApiUserEditModalComponent);
    const apiUserComponent = <ApiUserEditModalComponent>apiUserModalRef.componentInstance;
    apiUserComponent.apiUser = apiUser;
    apiUserModalRef.result.then(
      (updatedUser) => this.updateUser.emit(updatedUser),
      () => this.error()
    );
  }

  onUpdatePasswordDialog(apiUserId: string) {
    const passwordModalRef = this.modalService.openMedium(ApiUserPasswordModalComponent);
    const passwordComponent = <ApiUserPasswordModalComponent>passwordModalRef.componentInstance;
    passwordComponent.apiUserId = apiUserId;
    passwordModalRef.result.then(
      (id) => this.updatePassword.emit(id),
      () => this.error()
    );
  }

  error() {
    this.notificationService.error(FAILURE);
  }

}
