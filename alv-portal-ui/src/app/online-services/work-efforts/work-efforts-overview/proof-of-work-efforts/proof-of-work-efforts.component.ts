import { Component, EventEmitter, HostBinding, Inject, Input, OnInit, Output } from '@angular/core';
import { ProofOfWorkEffortsRepository } from '../../../../shared/backend-services/work-efforts/proof-of-work-efforts.repository';
import { WINDOW } from '../../../../core/window.service';
import { DOCUMENT } from '@angular/common';
import { I18nService } from '../../../../core/i18n.service';
import { ProofOfWorkEffortsModel } from './proof-of-work-efforts.model';
import { WorkEffortModel } from '../work-effort/work-effort.model';
import { FileSaverService } from '../../../../shared/file-saver/file-saver.service';
import { Observable } from 'rxjs';
import { fiveDaysAfterEndOfMonth, fiveDaysBeforeEndOfMonth } from '../../../../shared/forms/input/ngb-date-utils';
import { ProofOfWorkEffortsSubmitModalComponent } from './proof-of-work-efforts-submit-modal/proof-of-work-efforts-submit-modal.component';
import { ModalService } from '../../../../shared/layout/modal/modal.service';

@Component({
  selector: 'alv-proof-of-work-efforts',
  templateUrl: './proof-of-work-efforts.component.html',
  styleUrls: ['./proof-of-work-efforts.component.scss']
})
export class ProofOfWorkEffortsComponent implements OnInit {

  @Input() proofOfWorkEffortsModel: ProofOfWorkEffortsModel;

  @Input() expanded: boolean;

  @Output() reload = new EventEmitter<ProofOfWorkEffortsModel>();

  @HostBinding('class.current-period')
  isCurrentPeriod: boolean;

  downloadPdf$: Observable<Blob>;

  manualSubmitting: boolean;

  constructor(private proofOfWorkEffortsRepository: ProofOfWorkEffortsRepository,
              private i18nService: I18nService,
              private modalService: ModalService,
              private fileSaverService: FileSaverService,
              @Inject(DOCUMENT) private document: any,
              @Inject(WINDOW) private window: Window) {
  }

  ngOnInit() {
    this.isCurrentPeriod = this.proofOfWorkEffortsModel.isCurrentPeriod;
    this.expanded = this.expanded || this.proofOfWorkEffortsModel.isCurrentPeriod;
    this.downloadPdf$ = this.proofOfWorkEffortsRepository.downloadPdf(this.proofOfWorkEffortsModel.id);
    this.manualSubmitting = this.isCurrentPeriod && !this.proofOfWorkEffortsModel.isSentSuccessfully && this.currentDayValidForManuelSubmitting()
  }

  removeWorkEffort(deletedWorkEffort: WorkEffortModel) {
    const indexToRemove = this.proofOfWorkEffortsModel.workEfforts.findIndex(workEffortModel => workEffortModel.id === deletedWorkEffort.id);
    this.proofOfWorkEffortsModel.workEfforts.splice(indexToRemove, 1);
    this.reload.emit(this.proofOfWorkEffortsModel);
  }

  manualSubmitProofOfWorkEfforts() {
    console.log("got till here");
    const proofOfWorkEffortsSubmitModalRef = this.modalService.openMedium(ProofOfWorkEffortsSubmitModalComponent, true);
    const proofOfWorkEffortsSubmitComponent = <ProofOfWorkEffortsSubmitModalComponent>proofOfWorkEffortsSubmitModalRef.componentInstance;
    proofOfWorkEffortsSubmitComponent.proofOfWorkEffortsId = this.proofOfWorkEffortsModel.id;
    proofOfWorkEffortsSubmitModalRef.result
      .then(() => this.reload.emit(this.proofOfWorkEffortsModel))
      .catch(() => { });
  }

  private currentDayValidForManuelSubmitting(): boolean {
    const currentDate = new Date();
    return currentDate >= fiveDaysBeforeEndOfMonth() && currentDate <= fiveDaysAfterEndOfMonth();
  }
}
