import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JobAdSearchProfilesRepository } from '../../../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.repository';
import { NotificationsService } from '../../../../core/notifications.service';
import {
  catchError,
  flatMap,
  take,
  withLatestFrom
} from 'rxjs/operators';
import {
  EMPTY,
  throwError
} from 'rxjs';
import {
  select,
  Store
} from '@ngrx/store';
import {
  getJobSearchFilter,
  JobAdSearchState
} from '../../state-management/state';
import { getCurrentUser } from '../../../../core/state-management/state/core.state.ts';
import { JobSearchProfileService } from '../job-search-profile.service';
import {
  CreateJobAdSearchProfile,
  SearchProfileErrors
} from '../../../../shared/backend-services/job-ad-search-profiles/job-ad-search-profiles.types';

@Component({
  selector: 'alv-save-search-profile-modal',
  templateUrl: './save-search-profile-modal.component.html',
  styleUrls: ['./save-search-profile-modal.component.scss']
})
export class SaveSearchProfileModalComponent implements OnInit {

  readonly MAX_LENGTH_50 = 50;

  form: FormGroup;

  constructor(public activeModal: NgbActiveModal,
              private store: Store<JobAdSearchState>,
              private jobAdSearchProfilesRepository: JobAdSearchProfilesRepository,
              private jobSearchProfileService: JobSearchProfileService,
              private notificationsService: NotificationsService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.store.pipe(
      select(getCurrentUser),
      withLatestFrom(this.store.pipe(select(getJobSearchFilter))),
      take(1),
      flatMap(([currentUser, jobSearchFilter]) => {
        return this.jobAdSearchProfilesRepository.create(<CreateJobAdSearchProfile>{
          name: this.form.get('name').value,
          ownerUserId: currentUser.id,
          authorities: currentUser.authorities,
          searchFilter: this.jobSearchProfileService.mapToRequest(jobSearchFilter),
        })
          .pipe(
            catchError(error => {
              if (error.error.type) {

                if (error.error.type === SearchProfileErrors.PROFILE_ALREADY_EXISTS) {
                  this.form.get('name').setErrors({ nameAlreadyExists: true });
                  return EMPTY;
                }
              }
              return throwError(error);
            })
          );
      })
    )
      .subscribe(searchProfile => {
        this.notificationsService.success('portal.job-ad-search-profiles.notification.profile-saved');
        this.activeModal.close(searchProfile);
      });
  }

  onCancel() {
    this.activeModal.dismiss();
  }

}
