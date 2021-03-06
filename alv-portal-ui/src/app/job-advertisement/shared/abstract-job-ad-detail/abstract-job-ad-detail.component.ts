import { AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import {
  Notification,
  NotificationType
} from '../../../shared/layout/notifications/notification.model';
import { LayoutConstants } from '../../../shared/layout/layout-constants.enum';
import { Observable } from 'rxjs';
import { JobDetailModel } from '../job-detail-model';
import { JobBadge, JobBadgesMapperService } from '../job-badges-mapper.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  FavouriteItem,
  JobAdvertisement
} from '../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { isDeactivated, isExternal, isUnvalidated } from '../job-ad-rules';
import { JobDetailModelFactory } from '../job-detail-model-factory';
import { ScrollService } from '../../../core/scroll.service';
import { NotificationsService } from '../../../core/notifications.service';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { ComplaintModalComponent } from '../complaint-modal/complaint-modal.component';
import { filter, map, switchMap } from 'rxjs/operators';
import { FavouriteNoteModalComponent } from '../favourite-note-modal/favourite-note-modal.component';
import { FavouriteItemDetailModel } from './favourite-item-detail.model';
import { CONFIRM_DELETE_FAVOURITE_NOTE_MODAL } from '../job-ad-favourites.types';

export abstract class AbstractJobAdDetailComponent extends AbstractSubscriber implements OnInit, AfterViewInit {

  protected static readonly ALERTS = {
    jobAdExternal: {
      type: NotificationType.INFO,
      messageKey: 'job-detail.external-job-disclaimer',
      isSticky: true
    },
    jobAdDeactivated: {
      type: NotificationType.WARNING,
      messageKey: 'job-detail.deactivated',
      isSticky: true
    },
    jobAdUnvalidated: {
      type: NotificationType.INFO,
      messageKey: 'job-detail.unvalidated',
      isSticky: true
    },
    copiedLinkToClipboard: {
      type: NotificationType.SUCCESS,
      messageKey: 'global.messages.tooltip.link-copy.success',
      isSticky: false
    }
  };

  protected readonly JOB_SEARCH_BASE_URL = '/job-search';

  protected readonly JOB_FAVOURITES_BASE_URL = '/job-favourites';

  layoutConstants = LayoutConstants;

  jobDetailModel$: Observable<JobDetailModel>;

  prevEnabled$: Observable<boolean>;

  nextEnabled$: Observable<boolean>;

  badges$: Observable<JobBadge[]>;

  alerts$: Observable<Notification[]>;

  favouriteItemDetailModel$: Observable<FavouriteItemDetailModel>;

  @ViewChild(NgbTooltip, {static: false})
  clipboardTooltip: NgbTooltip;

  protected constructor(
    protected jobBadgesMapperService: JobBadgesMapperService,
    protected jobDetailModelFactory: JobDetailModelFactory,
    private scrollService: ScrollService,
    private notificationsService: NotificationsService,
    private modalService: ModalService) {
    super();
  }

  abstract get backButtonPath();

  ngAfterViewInit(): void {
    this.scrollService.scrollToTop();
  }

  ngOnInit() {
    const job$ = this.loadJob$().pipe(
      filter(job => !!job)
    );
    this.jobDetailModel$ = job$.pipe(
      switchMap((job) => this.jobDetailModelFactory.create(job))
    );
    this.alerts$ = job$.pipe(map(this.mapJobAdAlerts));
    this.badges$ = job$.pipe(map(job => this.jobBadgesMapperService.map(job)));
    this.prevEnabled$ = this.isPrevVisible();
    this.nextEnabled$ = this.isNextVisible();
    this.favouriteItemDetailModel$ =
      this.loadFavourite().pipe(
        filter((favouriteItem) => {
          // if the favouriteItem is undefined then it has not been loaded yet due the
          // the the current-user has not the privileges to do so or it's still being fetched
          return favouriteItem !== undefined;
        }),
        map((favouriteItem) => {
          return new FavouriteItemDetailModel(favouriteItem);
        })
      );
  }

  abstract loadJob$(): Observable<JobAdvertisement>;

  abstract loadFavourite(): Observable<FavouriteItem>;

  abstract loadPrev();

  abstract loadNext();

  abstract isPrevVisible(): Observable<boolean>;

  abstract isNextVisible(): Observable<boolean>;

  abstract addFavourite(jobAdvertisementId: string);

  abstract onRemoveFavourite(favouriteItem: FavouriteItem);

  abstract onUpdatedFavourite(updatedFavouriteItem: FavouriteItem);

  abstract getBackButtonText(): string;

  removeFavourite(favouriteItem: FavouriteItem) {
    if (favouriteItem.note) {
      this.modalService.openConfirm(
        CONFIRM_DELETE_FAVOURITE_NOTE_MODAL
      ).result.then(
        () => this.onRemoveFavourite(favouriteItem),
        () => {
        }
      );
    } else {
      this.onRemoveFavourite(favouriteItem);
    }
  }

  getEncodedUrl() {
    return encodeURIComponent(this.getJobUrl());
  }

  printJob() {
    window.print();
  }

  onCopyLink(): void {
    this.notificationsService.add(AbstractJobAdDetailComponent.ALERTS.copiedLinkToClipboard);
  }

  dismissAlert(alert: Notification, alerts: Notification[]) {
    alerts.splice(alerts.indexOf(alert), 1);
  }

  openComplaintModal(jobAdvertisementId: string) {
    const complaintModalRef = this.modalService.openLarge(ComplaintModalComponent);
    const complaintModalComponent = <ComplaintModalComponent>complaintModalRef.componentInstance;
    complaintModalComponent.jobAdvertisementId = jobAdvertisementId;
    complaintModalRef.result
      .then(() => {
        this.notificationsService.success('job-detail.complaint-modal.message.success', false);
      })
      .catch(() => {
      });
  }

  editNote(jobAdvertisementId: string, favouriteItem: FavouriteItem) {
    const favouriteNoteModalRef = this.modalService.openLarge(FavouriteNoteModalComponent, true);
    const favouriteNoteComponent = <FavouriteNoteModalComponent>favouriteNoteModalRef.componentInstance;
    favouriteNoteComponent.jobAdvertisementId = jobAdvertisementId;
    favouriteNoteComponent.favouriteItem = favouriteItem;
    favouriteNoteModalRef.result
      .then(updatedFavouriteItem => {
        this.onUpdatedFavourite(updatedFavouriteItem);
      })
      .catch(() => {
      });
  }

  getJobUrl() {
    // For sharing the URL (copy or send) we modify the URL to always point to Job-Search
    return window.location.href.replace(this.JOB_FAVOURITES_BASE_URL, this.JOB_SEARCH_BASE_URL);
  }

  private mapJobAdAlerts(job: JobAdvertisement): Notification[] {
    const alerts = [];
    if (isExternal(job)) {
      alerts.push(AbstractJobAdDetailComponent.ALERTS.jobAdExternal);
    }
    if (isDeactivated(job)) {
      alerts.push(AbstractJobAdDetailComponent.ALERTS.jobAdDeactivated);
    }
    if (isUnvalidated(job)) {
      alerts.push(AbstractJobAdDetailComponent.ALERTS.jobAdUnvalidated);
    }
    return alerts;
  }

}

