import { Injectable } from '@angular/core';
import {
  WorkEffortApplyStatusFilter,
  WorkEffortsFilter,
  WorkEffortsControlPeriodFilter
} from './work-efforts-overview-filter.types';
import { FilterBadge } from '../../../shared/layout/inline-badges/inline-badge.types';

@Injectable({
  providedIn: 'root'
})
export class WorkEffortsOverviewFilterBadgesMapper {

  constructor() { }

  mapFilterBadges(workEffortsFilter: WorkEffortsFilter): FilterBadge[] {
    const badges: FilterBadge[] = [];
    for (const key in workEffortsFilter) {
      if (key === 'controlPeriod' && workEffortsFilter[key] && workEffortsFilter[key] !== WorkEffortsControlPeriodFilter.ALL_MONTHS) {
        badges.push({
          label: 'portal.work-efforts.filter.control-period.' + workEffortsFilter[key],
          cssClass: 'badge-work-effort-control-period',
          key: key
        });
      } else if (key === 'applyStatus' && workEffortsFilter[key]) {

        if (workEffortsFilter[key] === WorkEffortApplyStatusFilter.INTERVIEW) {
          badges.push({
            cssClass: 'badge-work-effort-apply-status-interview',
            label: 'portal.work-efforts.apply-status.' + WorkEffortApplyStatusFilter.INTERVIEW,
            key
          });
        }

        if (workEffortsFilter[key] === WorkEffortApplyStatusFilter.EMPLOYED) {
          badges.push({
            cssClass: 'badge-work-effort-apply-status-employed',
            label: 'portal.work-efforts.apply-status.' + WorkEffortApplyStatusFilter.EMPLOYED,
            key
          });
        }

        if (workEffortsFilter[key] === WorkEffortApplyStatusFilter.PENDING) {
          badges.push({
            cssClass: 'badge-work-effort-apply-status-pending',
            label: 'portal.work-efforts.apply-status.' + WorkEffortApplyStatusFilter.PENDING,
            key
          });
        }

        if (workEffortsFilter[key] === WorkEffortApplyStatusFilter.REJECTED) {
          badges.push({
            cssClass: 'badge-work-effort-apply-status-rejected',
            label: 'portal.work-efforts.apply-status.' + WorkEffortApplyStatusFilter.REJECTED,
            key
          });
        }
      }
    }

    return badges;
  }
}
