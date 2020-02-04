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
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import {
  ApplyFilterValuesAction,
  ApplyQueryValuesAction,
  FILTER_APPLIED,
  getJobAdSearchProfile,
  getJobSearchFilter,
  getJobSearchResults,
  getLastVisitedJobAdId,
  getTotalCount,
  isLoading,
  JobAdSearchState,
  JobSearchFilter,
  LoadNextPageAction,
  ResetFilterAction,
  SearchProfileUpdatedAction
} from '../state-management';
import {
  ActionsSubject,
  select,
  Store
} from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  take,
  takeUntil,
  tap
} from 'rxjs/operators';
import { JobSearchFilterParameterService } from './job-search-filter-parameter.service';
import { JobQueryPanelValues } from '../../../widgets/job-search-widget/job-query-panel/job-query-panel-values';
import { ScrollService } from '../../../core/scroll.service';
import { FilterPanelValues } from './filter-panel/filter-panel.component';
import { ofType } from '@ngrx/effects';
import { composeResultListItemId } from '../../../shared/layout/result-list-item/result-list-item.component';
import { LayoutConstants } from '../../../shared/layout/layout-constants.enum';
import { WINDOW } from '../../../core/window.service';
import { JobSearchResult } from '../../shared/job-search-result/job-search-result.component';
import { I18nService } from '../../../core/i18n.service';
import {
  AddJobAdFavouriteAction,
  RemoveJobAdFavouriteAction,
  UpdatedJobAdFavouriteAction
} from '../../../core/state-management/actions/core.actions';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { User } from '../../../core/auth/user.model';
import {
  BlockUI,
  NgBlockUI
} from 'ng-block-ui';
import { IconKey } from '../../../shared/icons/custom-icon/custom-icon.component';
import { SaveSearchProfileModalComponent } from '../job-search-profile/save-search-profile-modal/save-search-profile-modal.component';
import { UpdateSearchProfileModalComponent } from '../job-search-profile/update-search-profile-modal/update-search-profile-modal.component';
import { JobAdSearchProfilesRepository } from '../../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.repository';
import { NotificationsService } from '../../../core/notifications.service';
import { JobSearchProfileService } from '../job-search-profile/job-search-profile.service';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { CONFIRM_DELETE_FAVOURITE_NOTE_MODAL } from '../../shared/job-ad-favourites.types';
import { ResolvedJobAdSearchProfile } from '../../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.types';
import { getJobAdDeleteConfirmModalConfig } from '../../../shared/search-profiles/modal-config.types';
import { JobAlertModalComponent } from '../../../shared/layout/search-profile-item/jobalert-modal/jobalert-modal.component';


@Component({
  selector: 'alv-job-search',
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobSearchComponent extends AbstractSubscriber implements OnInit, AfterViewInit, OnDestroy {

  IconKey = IconKey;

  layoutConstants = LayoutConstants;

  totalCount$: Observable<number>;

  jobSearchProfile$: Observable<ResolvedJobAdSearchProfile>;

  jobSearchFilter$: Observable<JobSearchFilter>;

  resultsAreLoading$: Observable<boolean>;

  jobSearchResults$: Observable<JobSearchResult[]>;

  jobSearchMailToLink$: Observable<string>;

  searchPanelHeight = 0;

  detectSearchPanelHeightFn = this.detectSearchPanelHeight.bind(this);

  currentUser$: Observable<User>;

  currentLanguage$: Observable<string>;

  disableSaveSearchProfileButton$: Observable<boolean>;

  @ViewChild('searchPanel', { static: false }) searchPanelElement: ElementRef<Element>;

  @BlockUI() blockUI: NgBlockUI;

  constructor(private store: Store<JobAdSearchState>,
              private actionsSubject: ActionsSubject,
              private jobSearchFilterParameterService: JobSearchFilterParameterService,
              private scrollService: ScrollService,
              private cdRef: ChangeDetectorRef,
              private modalService: ModalService,
              private i18nService: I18nService,
              private authenticationService: AuthenticationService,
              private jobAdSearchProfilesRepository: JobAdSearchProfilesRepository,
              private jobSearchProfileService: JobSearchProfileService,
              private notificationsService: NotificationsService,
              @Inject(WINDOW) private window: Window) {
    super();
  }

  ngOnInit() {
    this.totalCount$ = this.store.pipe(select(getTotalCount));

    this.jobSearchResults$ = this.store.pipe(select(getJobSearchResults)).pipe(
      filter(value => !!value)
    );

    this.jobSearchFilter$ = this.store.pipe(select(getJobSearchFilter));

    this.resultsAreLoading$ = this.store.pipe(select(isLoading)).pipe(
      distinctUntilChanged(),
      tap(loading => {
        if (loading) {
          this.blockUI.start();
        } else {
          this.blockUI.stop();
        }
      })
    );

    this.jobSearchProfile$ = this.store.pipe(select(getJobAdSearchProfile));

    this.jobSearchMailToLink$ = this.jobSearchFilter$.pipe(
      map((jobSearchFilter: JobSearchFilter) => this.jobSearchFilterParameterService.encode(jobSearchFilter)),
      map((filterParam) => `${this.window.location.href}?filter=${filterParam}`),
      map((link) => `mailto:?body=${link}`)
    );

    this.currentUser$ = this.authenticationService.getCurrentUser();

    this.currentLanguage$ = this.i18nService.currentLanguage$;

    this.disableSaveSearchProfileButton$ = this.jobSearchFilter$.pipe(
      map(searchFilter => {
        return searchFilter.occupations.length === 0 &&
          searchFilter.localities.length === 0 &&
          searchFilter.keywords.length === 0 &&
          !searchFilter.company;
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
    this.store.pipe(select(getLastVisitedJobAdId))
      .pipe(take(1))
      .subscribe(lastVisitedJobAdId => {
        if (lastVisitedJobAdId && this.scrollService.scrollIntoView(composeResultListItemId(lastVisitedJobAdId))) {
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

  onQueryChange(queryPanelValues: JobQueryPanelValues) {
    this.store.dispatch(new ApplyQueryValuesAction(queryPanelValues));
    this.detectSearchPanelHeight();
  }

  onFiltersChange(filterPanelData: FilterPanelValues) {
    this.store.dispatch(new ApplyFilterValuesAction(filterPanelData));
  }

  onResetFilter() {
    this.store.dispatch(new ResetFilterAction({}));
    // Give the search panel some time to adjust
    setTimeout(() => {
      this.detectSearchPanelHeight();
    });
  }

  onScroll() {
    this.store.dispatch(new LoadNextPageAction());
  }

  detectSearchPanelHeight() {
    const newSearchPanelHeight = this.searchPanelElement.nativeElement.clientHeight;
    if (newSearchPanelHeight !== this.searchPanelHeight) {
      this.searchPanelHeight = newSearchPanelHeight;
      this.cdRef.detectChanges();
    }
  }

  addFavourite(jobSearchResult: JobSearchResult) {
    this.store.dispatch(new AddJobAdFavouriteAction({ jobAdvertisementId: jobSearchResult.jobAdvertisement.id }));
  }

  removeFavourite(jobSearchResult: JobSearchResult) {
    if (jobSearchResult.favouriteItem.note) {
      this.modalService.openConfirm(
        CONFIRM_DELETE_FAVOURITE_NOTE_MODAL
      ).result.then(
        () => this.store.dispatch(new RemoveJobAdFavouriteAction({ favouriteItem: jobSearchResult.favouriteItem })),
        () => {
        }
      );
    } else {
      this.store.dispatch(new RemoveJobAdFavouriteAction({ favouriteItem: jobSearchResult.favouriteItem }));
    }
  }

  updatedFavourite(jobSearchResult: JobSearchResult) {
    this.store.dispatch(new UpdatedJobAdFavouriteAction({ favouriteItem: jobSearchResult.favouriteItem }));
  }

  trackById(index, item: JobSearchResult) {
    return item.hashCode;
  }

  saveSearchProfile() {
    this.jobSearchProfile$.pipe(
      take(1)
    ).subscribe(searchProfile => {
      if (searchProfile) {
        this.updateSearchProfile(searchProfile);
      } else {
        this.createSearchProfile();
      }
    });
  }

  updateSearchProfile(searchProfile: ResolvedJobAdSearchProfile) {
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
    this.jobSearchProfile$.pipe(
      take(1)
    ).subscribe(searchProfile => {
      if (searchProfile) {
        this.modalService.openConfirm(
          getJobAdDeleteConfirmModalConfig(searchProfile.name)
        ).result
          .then(result => {
            this.jobAdSearchProfilesRepository.delete(searchProfile.id)
              .subscribe(() => {
                this.store.dispatch(new SearchProfileUpdatedAction({ searchProfile: undefined }));
                this.notificationsService.success('portal.job-ad-search-profiles.notification.profile-deleted');
              });
          })
          .catch(() => {
          });
      }
    });
  }

  toggleJobAlert() {
    this.jobSearchProfile$.pipe(
      take(1)
    ).subscribe(searchProfile => {
      if (searchProfile) {
        const modalRef = this.modalService.openLarge(JobAlertModalComponent);
        const componentInstance = <JobAlertModalComponent>modalRef.componentInstance;
        componentInstance.searchProfile = searchProfile;
        modalRef.result
          .then(result => {
            this.jobSearchProfile$ = this.store.pipe(select(getJobAdSearchProfile))
          })
          .catch(() => {
          });
      }
    });
  }

  getTotalCountLabel(totalCount: string): string {
    return totalCount === '1' ? 'portal.job-ad-search.results-count.label.singular' :
      'portal.job-ad-search.results-count.label.plural';
  }

  private stopSpinner() {
    this.blockUI.reset();
  }

}


