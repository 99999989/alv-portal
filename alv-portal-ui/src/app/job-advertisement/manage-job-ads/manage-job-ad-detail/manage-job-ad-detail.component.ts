import { Component, OnInit } from '@angular/core';
import { JobBadge, JobBadgesMapperService } from '../../shared/job-badges-mapper.service';
import { JobDetailModelFactory } from '../../shared/job-detail-model-factory';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JobDetailModel } from '../../shared/job-detail-model';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import {
  getSelectedJobAdvertisement,
  isNextVisible,
  isPrevVisible,
  ManageJobAdsState
} from '../state-management/state';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { hasAnyAuthorities, UserRole } from '../../../core/auth/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { JobAdCancellationComponent } from '../../../widgets/manage-job-ads-widget/job-ad-cancellation/job-ad-cancellation.component';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import { JobAdvertisement } from '../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { JobAdvertisementUtils } from '../../../shared/backend-services/job-advertisement/job-advertisement.utils';
import {
  JobAdvertisementCancelledAction,
  LoadNextJobAdvertisementDetailAction,
  LoadPreviousJobAdvertisementDetailAction
} from '../state-management/actions';
import { LayoutConstants } from '../../../shared/layout/layout-constants.enum';

@Component({
  selector: 'alv-manage-job-ad-detail',
  templateUrl: './manage-job-ad-detail.component.html',
  styleUrls: ['./manage-job-ad-detail.component.scss']
})
export class ManageJobAdDetailComponent extends AbstractSubscriber implements OnInit {

  layoutConstants = LayoutConstants;

  jobDetailModel$: Observable<JobDetailModel>;

  badges$: Observable<JobBadge[]>;

  isPavOrCompany = false;

  private token: string;

  private jobAdvertisement: JobAdvertisement;

  public isCancellable = false;

  public prevEnabled$: Observable<boolean>;

  public nextEnabled$: Observable<boolean>;

  constructor(private jobBadgesMapperService: JobBadgesMapperService,
              private jobDetailModelFactory: JobDetailModelFactory,
              private store: Store<ManageJobAdsState>,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: ModalService,
              private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    const job$ = this.store.pipe(select(getSelectedJobAdvertisement))
      .pipe(filter(jobAdvertisement => !!jobAdvertisement));

    job$.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe(jobAdvertisement => {
        this.jobAdvertisement = jobAdvertisement;
        this.isCancellable = JobAdvertisementUtils.isJobAdvertisementCancellable(jobAdvertisement.status);
      });

    this.jobDetailModel$ = job$.pipe(
      switchMap((job) => this.jobDetailModelFactory.create(job))
    );

    this.badges$ = job$.pipe(map(job => this.jobBadgesMapperService.map(job)));

    this.route.queryParamMap.pipe(
      takeUntil(this.ngUnsubscribe))
      .subscribe((params) => this.token = params.get('token'));

    this.authenticationService.getCurrentUser()
      .pipe(
        map(user => hasAnyAuthorities(user, [UserRole.ROLE_COMPANY, UserRole.ROLE_PAV])),
        takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.isPavOrCompany = value;
      });

    this.prevEnabled$ = this.store.pipe(select(isPrevVisible));
    this.nextEnabled$ = this.store.pipe(select(isNextVisible));
  }

  prev() {
    this.store.dispatch(new LoadPreviousJobAdvertisementDetailAction());
  }

  next() {
    this.store.dispatch(new LoadNextJobAdvertisementDetailAction());
  }

  cancelJobAdAction() {
    const jobAdCancellationModalRef = this.modalService.openLarge(JobAdCancellationComponent);
    const jobAdCancellationComponent = <JobAdCancellationComponent>jobAdCancellationModalRef.componentInstance;
    jobAdCancellationComponent.jobAdvertisement = this.jobAdvertisement;
    jobAdCancellationComponent.accessToken = this.token;
    jobAdCancellationModalRef.result
      .then(value => {
        this.store.dispatch(new JobAdvertisementCancelledAction({ jobAdvertisement: value }));
      })
      .catch(() => {
      });
  }

  duplicateJobAdAction() {
    const queryParams = this.token
      ? { 'token': this.token }
      : { 'job-ad-id': this.jobAdvertisement.id };

    this.router.navigate(['job-publication'], { queryParams });
  }
}
