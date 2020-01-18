import { JobAlertFormValue } from './jobalert-modal.component';
import { JobAlertDto } from '../../../backend-services/job-ad-search-profiles/job-ad-search-profiles.types';

export function mapFormToDto(id: string, currentLanguage: string, formValue: JobAlertFormValue): JobAlertDto {
  return {
      searchProfileId: id,
      email: formValue.email,
      currentLanguage: currentLanguage,
      interval: formValue.interval,
  };
}
