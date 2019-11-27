import { JobAdvertisement, JobAdvertisementStatus, JobDescription } from './job-advertisement.types';
import { FALLBACK_LANGUAGE } from '../../../core/languages.constants';

export class JobAdvertisementUtils {

  static getJobDescription(jobAdvertisement: JobAdvertisement, lang: string = FALLBACK_LANGUAGE): JobDescription {
    return jobAdvertisement.jobContent.jobDescriptions
        .find(d => d.languageIsoCode === lang)
      || jobAdvertisement.jobContent.jobDescriptions[0];
  }


  static isJobAdvertisementCancellable(status: string | JobAdvertisementStatus): boolean {
    const statusEnum = typeof status === 'string' ? JobAdvertisementStatus[status] : status;
    return statusEnum !== JobAdvertisementStatus.INSPECTING
      && statusEnum !== JobAdvertisementStatus.REJECTED
      && statusEnum !== JobAdvertisementStatus.PUBLISHED_RESTRICTED
      && statusEnum !== JobAdvertisementStatus.CANCELLED;
  }

  static resolveJobAdvertisementStatus(jobAdvertisement: JobAdvertisement): JobAdvertisementStatus {
    if (jobAdvertisement.status === JobAdvertisementStatus.PUBLISHED_PUBLIC && !jobAdvertisement.publication.publicDisplay) {
      return JobAdvertisementStatus.NOT_PUBLISHED;
    }
    return jobAdvertisement.status;
  }

}
