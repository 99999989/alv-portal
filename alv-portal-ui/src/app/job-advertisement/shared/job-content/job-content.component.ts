import { Component, Input, OnInit } from '@angular/core';
import { JobDetailModel } from '../job-detail-model';
import { JobBadge } from '../job-badges-mapper.service';
import { JobAdvertisementUtils } from '../../../shared/backend-services/job-advertisement/job-advertisement.utils';

enum JobDetailPanelId {
  JOB_AD_INFO = 'job-ad-info',
  JOB_AD_REQUIREMENTS = 'job-ad-requirements',
  JOB_AD_LANGUAGES = 'job-ad-languages',
  JOB_AD_CONTACT_DETAILS = 'job-ad-contact-details'
}

@Component({
  selector: 'alv-job-content',
  templateUrl: './job-content.component.html',
  styleUrls: ['./job-content.component.scss']
})
export class JobContentComponent implements OnInit {

  @Input()
  jobDetailModel: JobDetailModel;

  @Input()
  badges: JobBadge[];

  @Input()
  showStatusInformation = false;

  jobDetailPanelId = JobDetailPanelId;

  constructor() {
  }

  ngOnInit() {
  }

  selectStatus() {
    return JobAdvertisementUtils.resolveJobAdvertisementStatus(this.jobDetailModel.jobAdvertisement);
  }

}
