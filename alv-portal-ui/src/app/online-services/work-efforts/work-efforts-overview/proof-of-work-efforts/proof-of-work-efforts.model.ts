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
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT, daysDifference
} from '../work-efforts-overview-filter.types';
import { daysBeforeEndOfMonth } from '../../../../shared/forms/input/ngb-date-utils';

export class ProofOfWorkEffortsModel {

  id: string;

  isSentSuccessfully: boolean;

  isClosed: boolean;

  isBeforeEmployment: boolean;

  controlPeriodDateString: string;

  monthValue: number;

  submissionDate: Date;

  startDate: Date;

  endDate: Date;

  submissionDateFormat: string;

  hasPdfDocument: boolean;

  statusLabel: string;

  isCurrentPeriod: boolean;

  workEfforts: WorkEffortModel[];

  constructor(private proofOfWorkEfforts: ProofOfWorkEfforts) {

    this.id = this.proofOfWorkEfforts.id;

    this.startDate = new Date(this.proofOfWorkEfforts.startDate + 'T00:00:00');

    this.endDate = new Date(this.proofOfWorkEfforts.endDate + 'T23:59:59');

    this.isSentSuccessfully = this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.SUBMITTED
      || this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.CLOSED;

    this.isClosed = this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.CLOSED;

    this.isBeforeEmployment = this.proofOfWorkEfforts.controlPeriod.type === ControlPeriodType.BEFORE_UNEMPLOYMENT;

    this.hasPdfDocument = !!this.proofOfWorkEfforts.documentId;

    this.controlPeriodDateString = this.proofOfWorkEfforts.controlPeriod.value;

    this.monthValue = this.proofOfWorkEfforts.controlPeriod.value ?
      parseInt(this.proofOfWorkEfforts.controlPeriod.value.split('-')[1], 10) : null;

    this.isCurrentPeriod = this.checkIsCurrentPeriod();

    this.submissionDate = this.buildSubmissionDateAndFormat();

    this.statusLabel = this.getStatusLabel();

    this.workEfforts = this.proofOfWorkEfforts.workEfforts.map(workEffort => new WorkEffortModel(workEffort, this.proofOfWorkEfforts));
  }

  private buildSubmissionDateAndFormat(): Date {
    let submissionDate;
    if (this.isCurrentPeriod && !this.isSentSuccessfully) {
      submissionDate = daysBeforeEndOfMonth(daysDifference());
      this.submissionDateFormat = DATE_FORMAT;
    } else if (this.isSentSuccessfully) {
      submissionDate = new Date(this.proofOfWorkEfforts.lastSubmittedAt);
      this.submissionDateFormat = DATE_FORMAT;
    } else {
      submissionDate = new Date(this.proofOfWorkEfforts.nextSubmissionDate);
      this.submissionDateFormat = DATE_TIME_FORMAT;
    }
    submissionDate.setHours(23, 59);
    return submissionDate;
  }

  private checkIsCurrentPeriod(): boolean {
    const today = new Date();
    return today >= this.startDate && today <= this.endDate;
  }

  private getStatusLabel(): string {
    const baseLabel = 'portal.work-efforts.submit-status.text.';
    if (this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.OPEN ||
      this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.RE_OPENED) {
      if (this.isCurrentPeriod && this.proofOfWorkEfforts) {
        return baseLabel + 'current-open';
      }
      return baseLabel + 'open';
    }
    if (this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.CLOSED) {
      return baseLabel + 'closed';
    }
    if (this.proofOfWorkEfforts.status === ProofOfWorkEffortsStatus.SUBMITTED && this.proofOfWorkEfforts.workEfforts.length === 0) {
      return baseLabel + 'submitted-without-work-effort';
    }
    return baseLabel + 'submitted';
  }

}
