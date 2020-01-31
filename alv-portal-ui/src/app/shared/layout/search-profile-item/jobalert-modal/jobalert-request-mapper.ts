import { JobAlertFormValue } from './jobalert-modal.component';
import { JobAlertDto } from '../../../backend-services/job-ad-search-profiles/job-ad-search-profiles.types';

export function mapFormToDto(contactLanguageIsoCode: string, formValue: JobAlertFormValue): JobAlertDto {
  return {
      email: formValue.email,
      contactLanguageIsoCode: contactLanguageIsoCode,
      interval: formValue.interval,
  };
}
