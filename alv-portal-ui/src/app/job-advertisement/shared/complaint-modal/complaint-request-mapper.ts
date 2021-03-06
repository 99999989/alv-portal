import { ComplaintDto } from '../../../shared/backend-services/complaint/complaint.types';
import { ComplaintFormValue } from './complaint-modal.component';

export function mapFormToDto(id: string, currentLanguage: string, formValue: ComplaintFormValue): ComplaintDto {
  return {
    jobAdvertisementId: id,
    contactInformation: {
      salutation: formValue.salutation,
      name: formValue.name,
      phone: formValue.phone,
      email: formValue.email,
      contactLanguage: currentLanguage,
    },
    complaintType: formValue.complaintType,
    complaintMessage: formValue.complaintMessage
  };
}
