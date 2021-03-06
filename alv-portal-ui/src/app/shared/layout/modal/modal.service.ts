import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalConfig } from './confirm-modal/confirm-modal-config.model';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NgbModal) {
  }

  openSmall(content: any, escapable?: boolean): NgbModalRef {
    return this.open(content, 'sm', escapable);
  }

  openMedium(content: any, escapable?: boolean): NgbModalRef {
    return this.open(content, null, escapable);
  }

  openLarge(content: any, escapable?: boolean): NgbModalRef {
    return this.open(content, 'lg', escapable);
  }

  openConfirm(config: ConfirmModalConfig): NgbModalRef {

    const modalRef = this.open(ConfirmModalComponent, config.size, false);
    const component = modalRef.componentInstance;
    component.title = config.title;
    component.content = config.content ;
    component.contentParams = config.contentParams || component.contentParams;
    component.confirmLabel = config.confirmLabel || component.confirmLabel;
    component.cancelLabel = config.cancelLabel || component.cancelLabel;

    return modalRef;
  }

  private open(content: any, size?: 'sm' | 'lg', escapable?: boolean): NgbModalRef {
    return this.modalService.open(content,
      {
        size: size,
        backdrop: escapable ? null : 'static',
        keyboard: !!escapable
      });
  }
}
