import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IconKey } from '../../../shared/icons/custom-icon/custom-icon.component';
import { ProofOfWorkEfforts } from '../../../shared/backend-services/work-efforts/proof-of-work-efforts.types';
import { ProofOfWorkEffortsRepository } from '../../../shared/backend-services/work-efforts/proof-of-work-efforts.repository';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { debounceTime, filter, flatMap, map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { WorkEffortsFilterModalComponent } from './work-efforts-filter-modal/work-efforts-filter-modal.component';
import {
  initialWorkEffortsFilter,
  WorkEffortApplyStatusFilter,
  WorkEffortsFilter,
  WorkEffortsFilterPeriod,
  WorkEffortsFilterValues
} from './work-efforts-overview-filter.types';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { FilterBadge } from '../../../shared/layout/inline-badges/inline-badge.types';
import { WorkEffortsOverviewFilterBadgesMapper } from './work-efforts-overview-filter-badges.mapper';
import {
  Notification,
  NotificationType
} from '../../../shared/layout/notifications/notification.model';
import { I18nService } from '../../../core/i18n.service';
import { Languages } from '../../../core/languages.constants';
import { ProofOfWorkEffortsModel } from './proof-of-work-efforts/proof-of-work-efforts.model';

@Component({
  selector: 'alv-work-efforts-overview',
  templateUrl: './work-efforts-overview.component.html',
  styleUrls: ['./work-efforts-overview.component.scss']
})
export class WorkEffortsOverviewComponent extends AbstractSubscriber implements OnInit {

  readonly SEARCH_QUERY_MAX_LENGTH = 1000;

  readonly SEARCH_QUERY_MIN_LENGTH = 3;

  readonly FILTER_RESET_VALUES = {
    period: WorkEffortsFilterPeriod.ALL_MONTHS,
    workEffortResult: WorkEffortApplyStatusFilter.ALL
  };

  englishNotSupportedNotification = {
    type: NotificationType.ERROR,
    messageKey: 'portal.work-efforts.proof-of-work-efforts.notification.no-english',
    isSticky: true
  } as Notification;

  IconKey = IconKey;

  form: FormGroup;

  proofOfWorkEffortsModels$: Observable<ProofOfWorkEffortsModel[]>;

  currentBadges: FilterBadge[];

  isEnglishLanguageSelected$: Observable<boolean>;

  private today = new Date();

  private _currentFilter: WorkEffortsFilter;

  get currentFilter(): WorkEffortsFilter {
    return this._currentFilter;
  }

  set currentFilter(value: WorkEffortsFilter) {
    this.currentBadges = this.workEffortsBadgesMapperService.mapFilterBadges(value);
    this._currentFilter = value;
  }
  constructor(private fb: FormBuilder,
              private modalService: ModalService,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              private workEffortsBadgesMapperService: WorkEffortsOverviewFilterBadgesMapper,
              private proofOfWorkEffortsRepository: ProofOfWorkEffortsRepository) {
    super();
  }

  ngOnInit() {
    this.currentFilter = initialWorkEffortsFilter;

    this.form = this.fb.group({
      query: ['']
    });

    this.proofOfWorkEffortsModels$ = this.authenticationService.getCurrentUser().pipe(
      filter(user => !!user),
      flatMap(user => this.proofOfWorkEffortsRepository.getProofOfWorkEfforts(user.id)),
      map(proofOfWorkEffortsList => proofOfWorkEffortsList.map(proofOfWorkEfforts => new ProofOfWorkEffortsModel(proofOfWorkEfforts)))
    );

    this.form.get('query').valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        if (value.length >= this.SEARCH_QUERY_MIN_LENGTH) {
          this.applyQuery(value);
        }
      });

    this.isEnglishLanguageSelected$ = this.i18nService.currentLanguage$.pipe(
      map(language => language === Languages.EN)
    );
  }

  openFilterModal() {
    const filterModalRef = this.modalService.openMedium(WorkEffortsFilterModalComponent);
    const filterComponent = <WorkEffortsFilterModalComponent>filterModalRef.componentInstance;
    filterComponent.currentFiltering = this._currentFilter;
    filterModalRef.result
      .then(newFilter => {
        this.applyFilter(newFilter);
      })
      .catch(() => {
      });
  }

  removeCurrentBadge(badge: FilterBadge) {
    const newFilter = { ...this.currentFilter };
    newFilter[badge.key] = this.FILTER_RESET_VALUES[badge.key];
    this.currentFilter = newFilter;
  }

  private applyFilter(newFilter: WorkEffortsFilterValues) {
    this.currentFilter = {
      ...this.currentFilter,
      period: newFilter.period,
      workEffortResult: newFilter.workEffortResult
    };
    // TODO: call search/filter endpoint
  }

  private applyQuery(newQuery: string) {
    this.currentFilter = {
      ...this.currentFilter,
      query: newQuery
    };
    // TODO: call search/filter endpoint
  }
}
