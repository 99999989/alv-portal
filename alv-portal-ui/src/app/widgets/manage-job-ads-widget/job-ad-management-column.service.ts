import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { I18nService } from '../../core/i18n.service';
import { map } from 'rxjs/operators';
import { JobAdvertisementUtils } from '../../shared/backend-services/job-advertisement/job-advertisement.utils';
import { LocaleAwareDatePipe } from '../../shared/pipes/locale-aware-date.pipe';
import {
  ManagedJobAdColumnDefinition,
  ManagedJobAdsSortingColumn
} from './job-ad-management-table/job-ad-management.table-types';

export const ALL_COLUMNS = [
  ManagedJobAdsSortingColumn.PUBLICATION_DATE,
  ManagedJobAdsSortingColumn.TITLE,
  ManagedJobAdsSortingColumn.EGOV,
  ManagedJobAdsSortingColumn.AVAM,
  ManagedJobAdsSortingColumn.LOCATION,
  ManagedJobAdsSortingColumn.STATUS,
  ManagedJobAdsSortingColumn.OWNER_NAME
];

@Injectable()
export class JobAdManagementColumnService {

  constructor(private i18n: I18nService, private localeAwareDatePipe: LocaleAwareDatePipe) {
  }

  public createColumnDefinitions(columns = ALL_COLUMNS): Observable<ManagedJobAdColumnDefinition[]> {
    return this.i18n.currentLanguage$.pipe(
      map(currentLang => {
        const newVar: ManagedJobAdColumnDefinition[] = [
          {
            column: ManagedJobAdsSortingColumn.PUBLICATION_DATE,
            columnName: 'dashboard.job-publication.publication-date',
            sortingEnabled: true,
            render: job => {
              return this.localeAwareDatePipe.transform(job.publication.startDate);
            }
          },
          {
            column: ManagedJobAdsSortingColumn.TITLE,
            columnName: 'dashboard.job-publication.job-title',
            sortingEnabled: true,
            render: job => {
              return JobAdvertisementUtils.getJobDescription(job, currentLang).title;
            }
          },
          {
            column: ManagedJobAdsSortingColumn.EGOV,
            columnName: 'dashboard.job-publication.job-room-id',
            sortingEnabled: true,
            render: job => {
              return job.stellennummerEgov;
            }
          },
          {
            column: ManagedJobAdsSortingColumn.AVAM,
            columnName: 'dashboard.job-publication.avam',
            sortingEnabled: true,
            render: job => {
              return job.stellennummerAvam;
            }
          },
          {
            column: ManagedJobAdsSortingColumn.LOCATION,
            columnName: 'dashboard.job-publication.location',
            sortingEnabled: true,
            render: job => {
              if (job.jobContent.location) {
                return job.jobContent.location.city;
              }
              return '-';
            }
          },
          {
            column: ManagedJobAdsSortingColumn.STATUS,
            columnName: 'dashboard.job-publication.status',
            sortingEnabled: true,
            render: job => {
              return 'global.job-publication.status.' + JobAdvertisementUtils.resolveJobAdvertisementStatus(job);
            }
          },
          {
            column: ManagedJobAdsSortingColumn.OWNER_NAME,
            columnName: 'portal.manage-job-ads.search.owner-name',
            sortingEnabled: true,
            render: job => {
              return job.owner.userDisplayName;
            }
          }
        ];
        return newVar;
      }),
      map(result => result.filter((b) => columns.includes(b.column)))
    );
  }
}
