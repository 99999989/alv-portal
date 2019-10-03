/**
 * A "view-model" for the Proof-Of-Work-Efforts Page that has all of our business logic in it to
 * avoid duplication and calculations in functions. Delegate pattern.
 */
import {
  ControlPeriodType,
  ProofOfWorkEfforts,
  ProofOfWorkEffortsStatus
} from '../../../../shared/backend-services/work-efforts/proof-of-work-efforts.types';
import { WorkEffortModel } from '../work-effort/work-effort.model';
import { deltaDate } from '../../../../shared/forms/input/ngb-date-utils';


export class ProofOfWorkEffortsModel {

  readonly WORK_EFFORT_MONTH_LIMIT = -6;

  id: string;

  isSentSuccessfully: boolean;

  isClosed: boolean;

  isBeforeEmployment: boolean;

  controlPeriodDateString: string;

  monthValue: number;

  submissionDate: Date;

  hasPdfDocument: boolean;

  statusLabel: string;

  isCurrentPeriod: boolean;

  workEfforts: WorkEffortModel[];

  constructor(private proofOfWorkEfforts: ProofOfWorkEfforts) {

    this.id = this.proofOfWorkEfforts.id;

    this.isSentSuccessfully = this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.SUBMITTED ||
      this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.CLOSED;

    this.isClosed = this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.CLOSED;

    this.isBeforeEmployment = this.proofOfWorkEfforts.controlPeriod.type === ControlPeriodType.BEFORE_UNEMPLOYMENT;

    this.controlPeriodDateString = this.proofOfWorkEfforts.controlPeriod.value;

    this.monthValue = this.proofOfWorkEfforts.controlPeriod.value ?
      parseInt(this.proofOfWorkEfforts.controlPeriod.value.split('-')[1], 10) : null;

    this.submissionDate = this.buildSubmissionDate();

    this.hasPdfDocument = !!this.proofOfWorkEfforts.documentId;

    this.statusLabel = this.getStatusLabel();

    this.isCurrentPeriod = this.checkIsCurrentPeriod();

    this.workEfforts = this.proofOfWorkEfforts.workEfforts.map(workEffort => new WorkEffortModel(workEffort, this.proofOfWorkEfforts));
  }

  private buildSubmissionDate(): Date {
    const submissionDate = new Date(this.isSentSuccessfully ?
      this.proofOfWorkEfforts.lastSubmittedAt : this.proofOfWorkEfforts.nextSubmissionDate);
    submissionDate.setHours(23, 59);
    return submissionDate;
  }

  private checkIsCurrentPeriod(): boolean {
    const today = new Date();
    const startDate = new Date(this.proofOfWorkEfforts.startDate + 'T00:00:00');
    const endDate = new Date(this.proofOfWorkEfforts.endDate + 'T00:00:00');
    return today >= startDate && today <= endDate;
  }

  private getStatusLabel(): string {
    const baseLabel = 'portal.work-efforts.submit-status.text.';
    if (this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.OPEN ||
      this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.RE_OPENED) {
      return baseLabel + 'open';
    }
    if (this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.SUBMITTED && this.proofOfWorkEfforts.workEfforts.length === 0) {
      if (this.isWorkEffortLimitReached()) {
        return baseLabel + 'closed';
      }
      return baseLabel + 'submitted-without-work-effort';
    }
    return baseLabel + 'submitted';
  }

  private isWorkEffortLimitReached() {
    const minDate = deltaDate(new Date(), 0, this.WORK_EFFORT_MONTH_LIMIT, 0);
    minDate.setDate(1);
    const endDate = new Date(this.proofOfWorkEfforts.endDate);
    return endDate < minDate;
  }

}

