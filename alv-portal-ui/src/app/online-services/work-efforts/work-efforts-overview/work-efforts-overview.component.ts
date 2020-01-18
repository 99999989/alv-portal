import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IconKey } from '../../../shared/icons/custom-icon/custom-icon.component';
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
  WorkEffortsControlPeriodFilter,
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
import { DEFAULT_PAGE_SIZE } from '../../../shared/backend-services/request-util';

@Component({
  selector: 'alv-work-efforts-overview',
  templateUrl: './work-efforts-overview.component.html',
  styleUrls: ['./work-efforts-overview.component.scss']
})
export class WorkEffortsOverviewComponent extends AbstractSubscriber implements OnInit {

  readonly SEARCH_QUERY_MAX_LENGTH = 1000;

  readonly SEARCH_QUERY_MIN_LENGTH = 3;

  readonly FILTER_RESET_VALUES = {
    period: WorkEffortsControlPeriodFilter.ALL_MONTHS,
    workEffortResult: WorkEffortApplyStatusFilter.ALL
  };

  englishNotSupportedNotification = {
    type: NotificationType.ERROR,
    messageKey: 'portal.online-forms.notification.no-english',
    isSticky: true
  } as Notification;

  IconKey = IconKey;

  form: FormGroup;

  proofOfWorkEffortsModels: ProofOfWorkEffortsModel[];

  currentBadges: FilterBadge[];

  isEnglishLanguageSelected$: Observable<boolean>;

  private _currentFilter: WorkEffortsFilter;

  private page = 0;

  get currentFilter(): WorkEffortsFilter {
    return this._currentFilter;
  }

  set currentFilter(value: WorkEffortsFilter) {
    this.currentBadges = this.workEffortsOverviewFilterBadgesMapper.mapFilterBadges(value);
    this._currentFilter = value;
  }

  constructor(private fb: FormBuilder,
              private modalService: ModalService,
              private authenticationService: AuthenticationService,
              private i18nService: I18nService,
              private workEffortsOverviewFilterBadgesMapper: WorkEffortsOverviewFilterBadgesMapper,
              private proofOfWorkEffortsRepository: ProofOfWorkEffortsRepository) {
    super();
  }

  ngOnInit() {
    this.currentFilter = initialWorkEffortsFilter;

    this.form = this.fb.group({
      query: ['']
    });

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

    this.loadItems();
  }

  loadItems() {
    this.authenticationService.getCurrentUser().pipe(
      filter(user => !!user),
      flatMap(user => this.proofOfWorkEffortsRepository.search({
          page: this.page++,
          size: DEFAULT_PAGE_SIZE,
          body: {...this.currentFilter, ownerUserId: user.id}
        }
      )),
      map(response => response.content),
      map(proofOfWorkEffortsList => proofOfWorkEffortsList.map(proofOfWorkEfforts => new ProofOfWorkEffortsModel(proofOfWorkEfforts)))
    ).subscribe(proofOfWorkEffortsModels => {
      this.proofOfWorkEffortsModels = [...(this.proofOfWorkEffortsModels || []), ...proofOfWorkEffortsModels];
    });
  }

  reload() {
    this.page = 0;
    this.proofOfWorkEffortsModels = [];
    this.loadItems();
  }

  reloadProofOfWorkEfforts(proofOfWorkEffortsModel: ProofOfWorkEffortsModel) {
    this.proofOfWorkEffortsRepository.getProofOfWorkEffortsById(proofOfWorkEffortsModel.id)
      .subscribe(reloadedProofOfWorkEfforts => {
        const indexToUpdate = this.proofOfWorkEffortsModels.findIndex(model => model.id === reloadedProofOfWorkEfforts.id);
        this.proofOfWorkEffortsModels[indexToUpdate] = new ProofOfWorkEffortsModel(reloadedProofOfWorkEfforts);
      });
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
      controlPeriod: newFilter.controlPeriod,
      applyStatus: newFilter.applyStatus
    };
    this.reload();
  }

  private applyQuery(newQuery: string) {
    this.currentFilter = {
      ...this.currentFilter,
      query: newQuery
    };
    this.reload();
  }
}
