import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ApiUser,
  ApiUserColumnDefinition
} from '../../../shared/backend-services/api-user-management/api-user-management.types';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { ApiUserManagementRepository } from '../../../shared/backend-services/api-user-management/api-user-management-repository';
import { NotificationsService } from '../../../core/notifications.service';
import { ConfirmModalConfig } from '../../../shared/layout/modal/confirm-modal/confirm-modal-config.model';
import { ApiUserModalComponent } from '../api-user-modal/api-user-modal.component';
import { ApiUserPasswordModalComponent } from '../api-user-password-modal/api-user-password-modal.component';
import { mapApiUserColumnDefinitionToSort } from '../api-user-management-request.mapper';

@Component({
  selector: 'alv-api-user-management-table',
  templateUrl: './api-user-management-table.component.html',
  styleUrls: ['api-user-management-table.component.scss']
})
export class ApiUserManagementTableComponent implements OnInit {

  readonly CONFIRM_CHANGE_STATUS_MODAL: ConfirmModalConfig = {
    title: 'portal.admin.api-user-management.change-status-dialog.title',
    content: 'portal.admin.api-user-management.change-status-dialog.question',
    confirmLabel: 'portal.admin.user-info.confirm-dialog.yes',
    cancelLabel: 'portal.admin.user-info.confirm-dialog.no'
  };

  readonly COLUMN_NAMES = ['username', 'companyName', 'companyEmail', 'technicalContactName', 'technicalContactEmail',
    'createDate', 'lastAccessDate', 'active'];

  @Input()
  apiUserList: ApiUser[];

  @Input()
  currentSorting: ApiUserColumnDefinition;

  @Input()
  page: number;

  @Output()
  sort = new EventEmitter<string>();

  @Output()
  scroll = new EventEmitter<number>();

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
    this.columnDefinitions = this.COLUMN_NAMES.map((columnName) => {
      return {
        columnName: columnName,
        sorting: ''
      } as ApiUserColumnDefinition;
    });
  }

  onScroll() {
    this.scroll.emit(this.page + 1);
  }

  onSort(column: string) {
    this.sort.emit(mapApiUserColumnDefinitionToSort(this.currentSorting, column));
  }

  onStatusChangeDialog(apiUser: ApiUser, active: boolean) {
    const changedUser = {...apiUser, active};
    this.modalService.openConfirm(this.CONFIRM_CHANGE_STATUS_MODAL).result.then(
      () => this.apiUserManagementRepository.toggleStatus(changedUser)
        .subscribe(() => this.statusChange.emit(), () => {}),
      () => {}
    );
  }

  onUpdateUserDialog(apiUser: ApiUser) {
    const apiUserModalRef = this.modalService.openLarge(ApiUserModalComponent);
    const apiUserComponent = <ApiUserModalComponent>apiUserModalRef.componentInstance;
    apiUserComponent.apiUser = apiUser;
    apiUserModalRef.result.then(
      (updatedUser) => this.updateUser.emit(updatedUser),
      () => {}
    );
  }

  onUpdatePasswordDialog(apiUserId: string) {
    const passwordModalRef = this.modalService.openMedium(ApiUserPasswordModalComponent);
    const passwordComponent = <ApiUserPasswordModalComponent>passwordModalRef.componentInstance;
    passwordComponent.apiUserId = apiUserId;
    passwordModalRef.result.then(
      (id) => this.updatePassword.emit(id),
      () => {}
    );
  }

}
