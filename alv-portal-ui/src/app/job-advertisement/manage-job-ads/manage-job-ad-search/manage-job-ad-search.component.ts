import { Component, OnInit } from '@angular/core';
import {
  getManagedJobAdResults,
  getManagedJobAdsSearchFilter,
  ManagedJobAdsSearchFilter,
  ManagedJobAdsSort,
  ManageJobAdsState,
  SortDirection
} from '../state-management/state';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobAdvertisement } from '../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { ApplyFilterAction, LoadNextPageAction } from '../state-management/actions';
import { FilterManagedJobAdsComponent } from './filter-managed-job-ads/filter-managed-job-ads.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { InlineBadge } from '../../../shared/layout/inline-badges/inline-badge.types';
import { ManagedJobAdSearchFilterValues } from './managed-job-ad-search-types';

interface InlineFilterBadge extends InlineBadge {
  key: string; // is needed to identify the filter that corresponds to a badge
}

interface ColumnHeader {
  backendKey: ManagedJobAdsSort;
  translationKey: string;
}

@Component({
  selector: 'alv-manage-job-ad-search',
  templateUrl: './manage-job-ad-search.component.html',
  styleUrls: ['./manage-job-ad-search.component.scss']
})
export class ManageJobAdSearchComponent implements OnInit {

  constructor(private store: Store<ManageJobAdsState>,
              private modalService: ModalService,
              private fb: FormBuilder) {
  }

  jobSearchResults$: Observable<JobAdvertisement[]>;

  currentFilter$: Observable<ManagedJobAdsSearchFilter>;

  form: FormGroup;

  currentBadges$: Observable<InlineFilterBadge[]>;


  columns: ColumnHeader[];

  SortDirection = SortDirection;

  /**
   * todo looks very ad-hoc, is it possible to make it nicer
   * @param filter
   */
  private static mapBadges(filter) {
    let badges = [];
    for (const key in filter) {
      if (key === 'onlineSinceDays' && filter[key]) {
        badges.push({
          label: 'dashboard.job-publication.publication-period.' + filter[key],
          cssClass: 'badge-manage-jobads-filter',
          key
        });
      } else if (key === 'ownerUserId' && filter[key]) {
        badges.push({
          label: 'portal.dashboard.job-publication.createdBy.me',
          cssClass: 'badge-manage-jobads-filter',
          key
        });
      } else if (key === 'status' && filter [key]) {
        badges.push({
          label: 'portal.dashboard.job-publication.createdBy.' + filter[key],
          css: 'badge-manage-jobads-filter',
          key
        });
      } else if (!filter[key]) {
        badges = badges.filter(badge => badge.key);
      }
    }

    return badges;
  }

  ngOnInit() {
    this.columns = [
      {
        backendKey: ManagedJobAdsSort.PUBLICATION_DATE,
        translationKey: 'dashboard.job-publication.publication-date'
      },
      {
        backendKey: ManagedJobAdsSort.TITLE,
        translationKey: 'dashboard.job-publication.job-title'
      },
      {
        backendKey: ManagedJobAdsSort.EGOV,
        translationKey: 'dashboard.job-publication.job-room-id'
      },
      {
        backendKey: ManagedJobAdsSort.AVAM,
        translationKey: 'dashboard.job-publication.avam'
      },
      {
        backendKey: ManagedJobAdsSort.LOCATION,
        translationKey: 'dashboard.job-publication.location'
      },
      {
        backendKey: ManagedJobAdsSort.STATUS,
        translationKey: 'dashboard.job-publication.status'
      },
      {
        backendKey: ManagedJobAdsSort.OWNER_NAME,
        translationKey: 'portal.dashboard.job-publication.owner-name'
      }
    ];
    this.jobSearchResults$ = this.store.pipe(select(getManagedJobAdResults));

    this.currentFilter$ = this.store.pipe(select(getManagedJobAdsSearchFilter));

    this.currentBadges$ = this.currentFilter$.pipe(
      map(ManageJobAdSearchComponent.mapBadges)
    );

    this.form = this.fb.group({
      query: [null]
    });
  }

  onScroll() {
    this.store.dispatch(new LoadNextPageAction());
  }

  removeCurrentBadge(badge: InlineFilterBadge) {
    this.currentFilter$.pipe(take(1))
      .subscribe(currentFilter => {
        const newFilter = { ...currentFilter };
        newFilter[badge.key] = null;
        this.store.dispatch(new ApplyFilterAction(newFilter));
      });
  }

  onFilterClick() {
    this.currentFilter$.pipe(take(1))
      .subscribe(currentFilter => {
        const filterModalRef = this.modalService.openMedium(FilterManagedJobAdsComponent);
        const filterComponent = <FilterManagedJobAdsComponent>filterModalRef.componentInstance;
        filterComponent.currentFiltering = currentFilter;
        filterModalRef.result
          .then(newFilter => {
            this.applyFilter(newFilter);
          })
          .catch(() => {
          });
      });
  }

  onQueryChange($event) {
    this.applyQuery($event.target.value);
  }

  onSortChange(selectedColumn: ManagedJobAdsSort, current: { column: ManagedJobAdsSort; direction: SortDirection }) {
    const direction = this.determineSortDirection(selectedColumn, current);
    this.applySort({ column: selectedColumn, direction: direction });
  }

  private determineSortDirection(selectedColumn: ManagedJobAdsSort, current: { column: ManagedJobAdsSort; direction: SortDirection }) {
    if (selectedColumn !== current.column) {
      return SortDirection.ASC;
    }
    return current.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
  }

  private applyFilter(newFilter: ManagedJobAdSearchFilterValues) {
    this.currentFilter$.pipe(take(1)).subscribe(value => {
      this.store.dispatch(new ApplyFilterAction({
        ...value,
        onlineSinceDays: newFilter.onlineSinceDays,
        ownerUserId: newFilter.ownerUserId,
        status: newFilter.status
      }));
    });
  }

  private applyQuery(newQuery: string) {
    this.currentFilter$.pipe(take(1)).subscribe(value => {
      this.store.dispatch(new ApplyFilterAction({
        ...value,
        query: newQuery
      }));
    });
  }

  private applySort(newSort: { column: ManagedJobAdsSort; direction: SortDirection }) {
    this.currentFilter$.pipe(take(1)).subscribe(value => {
      this.store.dispatch(new ApplyFilterAction({
        ...value,
        sort: newSort
      }));
    });
  }
}
