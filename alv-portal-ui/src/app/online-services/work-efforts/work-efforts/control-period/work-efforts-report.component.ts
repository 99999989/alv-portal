import { Component, HostBinding, Input, OnInit } from '@angular/core';
import {
  WorkEffort,
  WorkEffortsReport,
  WorkEffortsReportStatus,
  WorkEffortType
} from '../../../../shared/backend-services/work-efforts/work-efforts.types';

@Component({
  selector: 'alv-work-efforts-report',
  templateUrl: './work-efforts-report.component.html',
  styleUrls: ['./work-efforts-report.component.scss']
})
export class WorkEffortsReportComponent implements OnInit {

  @Input() workEffortsReport: WorkEffortsReport;

  @Input() expanded: boolean;

  @HostBinding('class.current-period')
  @Input() isCurrentPeriod: boolean;

  constructor() {
  }

  ngOnInit() {
    this.expanded = this.isCurrentPeriod;
  }

  isSentSuccessfully(workEffortsReport: WorkEffortsReport): boolean {
    return workEffortsReport.status === WorkEffortsReportStatus.SUBMITTED;
  }

  isBeforeEmployment(workEffortsReport: WorkEffortsReport): boolean {
    return workEffortsReport.type === WorkEffortType.BEFORE_UNEMPLOYMENT;
  }

  getDateStringFromControlPeriod(workEffortsReport: WorkEffortsReport): string {
    const date = new Date(workEffortsReport.controlPeriod);
    return `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}`;
  }

  getPdfFileNamePrefix(): string {
    return this.isCurrentPeriod ?
      'portal.work-efforts.control-period.pdf-file.temporary-name' :
      'portal.work-efforts.control-period.pdf-file.name';
  }

  removeWorkEffort(deletedWorkEffort: WorkEffort) {
    const indexToRemove = this.workEffortsReport.workEfforts.findIndex(workEffort => workEffort.id === deletedWorkEffort.id);
    this.workEffortsReport.workEfforts.splice(indexToRemove, 1);
  }
}
