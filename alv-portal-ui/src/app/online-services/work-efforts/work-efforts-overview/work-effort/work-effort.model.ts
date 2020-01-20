/**
 * A "view-model" for the Work-Effort Component that has all of our business logic in it to
 * avoid duplication and calculations in functions. Delegate pattern.
 */
import {
  ProofOfWorkEfforts,
  WorkEffort,
  WorkEffortApplyStatus
} from '../../../../shared/backend-services/work-efforts/proof-of-work-efforts.types';
import { InlineBadge } from '../../../../shared/layout/inline-badges/inline-badge.types';


export class WorkEffortModel {

  id: string;

  proofOfWorkEffortsId: string;

  createdAt: Date;

  applyDate: Date;

  companyName: string;

  occupation: string;

  applyStatusBadges: InlineBadge[];

  isSentSuccessfully: boolean;

  submissionDate: Date;

  submissionDateFormat: string;

  statusLabel: string;

  workEffortEditLink: string;

  constructor(private workEffort: WorkEffort,
              private proofOfWorkEfforts: ProofOfWorkEfforts) {

    this.id = this.workEffort.id;

    this.proofOfWorkEffortsId = this.proofOfWorkEfforts.id;

    this.createdAt = new Date(this.workEffort.createdAt);

    this.applyDate = new Date(this.workEffort.applyDate);

    this.companyName = this.workEffort.applyChannel.address.name;

    this.occupation = this.workEffort.occupation;

    this.applyStatusBadges = this.mapApplyStatusBadges(this.workEffort.applyStatus);

    this.isSentSuccessfully = !!this.workEffort.submittedAt;

    this.submissionDate = this.buildSubmissionDate();

    this.submissionDateFormat = this.isSentSuccessfully ? 'dd.MM.yyyy' : 'dd.MM.yyyy HH:mm';

    this.statusLabel = 'portal.work-efforts.submit-status.text.' + (this.isSentSuccessfully ? 'submitted-date' : 'open');

    this.workEffortEditLink = `edit/${this.proofOfWorkEfforts.id}/${this.id}`;
  }

  private buildSubmissionDate(): Date {
    if (this.workEffort.submittedAt) {
      return new Date(this.workEffort.submittedAt);
    }
    if (this.proofOfWorkEfforts.nextSubmissionDate) {
      const submissionDate = new Date(this.proofOfWorkEfforts.nextSubmissionDate);
      submissionDate.setHours(23, 59);
      return submissionDate;
    }
  }

  private mapApplyStatusBadges(applyStatus: WorkEffortApplyStatus[]): InlineBadge[] {
    const badges: InlineBadge[] = [];

    if (applyStatus.includes(WorkEffortApplyStatus.INTERVIEW)) {
      badges.push({
        cssClass: 'badge-work-effort-apply-status-interview',
        label: 'portal.work-efforts.apply-status.' + WorkEffortApplyStatus.INTERVIEW
      });
    }

    if (applyStatus.includes(WorkEffortApplyStatus.EMPLOYED)) {
      badges.push({
        cssClass: 'badge-work-effort-apply-status-employed',
        label: 'portal.work-efforts.apply-status.' + WorkEffortApplyStatus.EMPLOYED
      });
    }

    if (applyStatus.includes(WorkEffortApplyStatus.PENDING)) {
      badges.push({
        cssClass: 'badge-work-effort-apply-status-pending',
        label: 'portal.work-efforts.apply-status.' + WorkEffortApplyStatus.PENDING
      });
    }

    if (applyStatus.includes(WorkEffortApplyStatus.REJECTED)) {
      badges.push({
        cssClass: 'badge-work-effort-apply-status-rejected',
        label: 'portal.work-efforts.apply-status.' + WorkEffortApplyStatus.REJECTED
      });
    }
    return badges;
  }

}

