import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApplyFilterValuesAction,
  ApplyQueryValuesAction,
  CandidateSearchFilter,
  CandidateSearchResult,
  CandidateSearchState,
  FILTER_APPLIED,
  getCandidateSearchFilter,
  getCandidateSearchProfile,
  getCandidateSearchResults,
  getResultsAreLoading,
  getSelectedCandidateProfile,
  getTotalCount,
  LoadNextPageAction,
  ResetFilterAction,
  SearchProfileUpdatedAction
} from '../state-management';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { distinctUntilChanged, filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { ScrollService } from '../../../core/scroll.service';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { composeResultListItemId } from '../../../shared/layout/result-list-item/result-list-item.component';
import { CandidateSearchFilterParameterService } from './candidate-search-filter-parameter.service';
import { FilterPanelValues } from './filter-panel/filter-panel.component';
import { CandidateQueryPanelValues } from '../../../widgets/candidate-search-widget/candidate-query-panel/candidate-query-panel-values';
import { LayoutConstants } from '../../../shared/layout/layout-constants.enum';
import { WINDOW } from '../../../core/window.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserRole } from '../../../core/auth/user.model';
import { getCandidateDeleteConfirmModalConfig } from '../../../shared/search-profiles/modal-config.types';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CandidateSearchProfilesRepository } from '../../../shared/backend-services/candidate-search-profiles/candidate-search-profiles.repository';
import { NotificationsService } from '../../../core/notifications.service';
import { ResolvedCandidateSearchProfile } from '../../../shared/backend-services/candidate-search-profiles/candidate-search-profiles.types';
import { UpdateSearchProfileModalComponent } from './candidate-search-profile/update-search-profile-modal/update-search-profile-modal.component';
import { SaveSearchProfileModalComponent } from './candidate-search-profile/save-search-profile-modal/save-search-profile-modal.component';

@Component({
  selector: 'alv-candidate-search',
  templateUrl: './candidate-search.component.html',
  styleUrls: ['./candidate-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateSearchComponent extends AbstractSubscriber implements OnInit, AfterViewInit, OnDestroy {

  candidateSearchProfileRoles = [
    UserRole.ROLE_PAV,
    UserRole.ROLE_COMPANY,
    UserRole.ROLE_ADMIN,
    UserRole.ROLE_SYSADMIN
  ];

  layoutConstants = LayoutConstants;

  totalCount$: Observable<number>;

  candidateSearchFilter$: Observable<CandidateSearchFilter>;

  resultsAreLoading$: Observable<boolean>;

  candidateSearchResults$: Observable<CandidateSearchResult[]>;

  candidateSearchProfile$: Observable<ResolvedCandidateSearchProfile>;

  searchMailToLink$: Observable<string>;

  disableSaveSearchProfileButton$: Observable<boolean>;

  detectSearchPanelHeightFn = this.detectSearchPanelHeight.bind(this);

  searchPanelHeight = 0;

  @ViewChild('searchPanel', { static: false }) searchPanelElement: ElementRef<Element>;


  @BlockUI() blockUI: NgBlockUI;

  constructor(private store: Store<CandidateSearchState>,
              private candidateSearchFilterParameterService: CandidateSearchFilterParameterService,
              private actionsSubject: ActionsSubject,
              private scrollService: ScrollService,
              private modalService: ModalService,
              private notificationsService: NotificationsService,
              private candidateSearchProfilesRepository: CandidateSearchProfilesRepository,
              private cdRef: ChangeDetectorRef,
              @Inject(WINDOW) private window: Window) {
    super();
  }

  ngOnInit() {
    this.totalCount$ = this.store.pipe(select(getTotalCount));

    this.candidateSearchFilter$ = this.store.pipe(select(getCandidateSearchFilter));

    this.candidateSearchResults$ = this.store.pipe(select(getCandidateSearchResults)).pipe(
      filter(value => !!value)
    );

    this.resultsAreLoading$ = this.store.pipe(select(getResultsAreLoading)).pipe(
      distinctUntilChanged(),
      tap(loading => {
        if (loading) {
          this.blockUI.start();
        } else {
          this.blockUI.stop();
        }
      })
    );

    this.candidateSearchProfile$ = this.store.pipe(select(getCandidateSearchProfile));

    this.searchMailToLink$ = this.candidateSearchFilter$.pipe(
      map((candidateSearchFilter: CandidateSearchFilter) => this.candidateSearchFilterParameterService.encode(candidateSearchFilter)),
      map((filterParam) => `${this.window.location.href}?filter=${filterParam}`),
      map((link) => `mailto:?body=${link}`)
    );

    this.disableSaveSearchProfileButton$ = this.candidateSearchFilter$.pipe(
      map(searchFilter => {
        return searchFilter.occupations.length === 0 &&
          searchFilter.keywords.length === 0 &&
          !searchFilter.workplace;
      })
    );

    this.actionsSubject.pipe(
      ofType(FILTER_APPLIED),
      takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.scrollService.scrollToTop();
      });
  }

  ngAfterViewInit() {
    this.detectSearchPanelHeight();
    // Add resize listener to recalculate UI on window resize
    this.window.addEventListener('resize', this.detectSearchPanelHeightFn);
    this.store.pipe(select(getSelectedCandidateProfile))
      .pipe(take(1))
      .subscribe(candidateProfile => {
        if (candidateProfile && this.scrollService.scrollIntoView(composeResultListItemId(candidateProfile.id))) {
          this.scrollService.scrollBy(0, LayoutConstants.SCROLL_Y_SEARCH - this.searchPanelHeight);
        } else {
          this.scrollService.scrollToTop();
        }
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.window.removeEventListener('resize', this.detectSearchPanelHeightFn);
    this.stopSpinner();
  }

  onScroll() {
    this.store.dispatch(new LoadNextPageAction());
  }

  onFiltersChange(filterPanelValues: FilterPanelValues) {
    this.store.dispatch(new ApplyFilterValuesAction(filterPanelValues));
  }

  onResetFilter() {
    this.store.dispatch(new ResetFilterAction({}));
    setTimeout(() => {
      this.detectSearchPanelHeight();
    });
  }

  onQueryChange(queryValues: CandidateQueryPanelValues) {
    this.store.dispatch(new ApplyQueryValuesAction(queryValues));
    this.detectSearchPanelHeight();
  }

  detectSearchPanelHeight() {
    const newSearchPanelHeight = this.searchPanelElement.nativeElement.clientHeight;
    if (newSearchPanelHeight !== this.searchPanelHeight) {
      this.searchPanelHeight = newSearchPanelHeight;
      this.cdRef.detectChanges();
    }
  }

  saveSearchProfile() {
    this.candidateSearchProfile$.pipe(
      take(1)
    ).subscribe(searchProfile => {
      if (searchProfile) {
        this.updateSearchProfile(searchProfile);
      } else {
        this.createSearchProfile();
      }
    });
  }

  updateSearchProfile(searchProfile: ResolvedCandidateSearchProfile) {
    const modalRef = this.modalService.openMedium(UpdateSearchProfileModalComponent);
    modalRef.componentInstance.searchProfile = searchProfile;
    modalRef.result
      .then(
        (result) => {
          if (result) {
            this.store.dispatch(new SearchProfileUpdatedAction({ searchProfile: result }));
          } else {
            this.createSearchProfile();
          }
        })
      .catch(() => {
      });
  }

  createSearchProfile() {
    const modalRef = this.modalService.openMedium(SaveSearchProfileModalComponent);
    modalRef.result
      .then((searchProfile) => {
        this.store.dispatch(new SearchProfileUpdatedAction({ searchProfile: searchProfile }));
      })
      .catch(() => {
      });
  }

  deleteSearchProfile() {
    this.candidateSearchProfile$.pipe(
      take(1)
    ).subscribe(searchProfile => {
      if (searchProfile) {
        this.modalService.openConfirm(
          getCandidateDeleteConfirmModalConfig(searchProfile.name)
        ).result
          .then(result => {
            this.candidateSearchProfilesRepository.delete(searchProfile.id)
              .subscribe(() => {
                this.store.dispatch(new SearchProfileUpdatedAction({ searchProfile: undefined }));
                this.notificationsService.success('portal.candidate-search-profiles.notification.profile-deleted');
              });
          })
          .catch(() => {
          });
      }
    });
  }

  getTotalCountLabel(totalCount: string): string {
    return totalCount === '1' ? 'portal.candidate-search.results-count.label.singular' :
      'portal.candidate-search.results-count.label.plural';
  }

  trackByHash(index: number, item: CandidateSearchResult) {
    return item.hashCode;
  }

  private stopSpinner() {
    this.blockUI.reset();
  }
}
