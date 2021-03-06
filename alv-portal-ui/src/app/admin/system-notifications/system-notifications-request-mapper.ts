import { SystemNotificationDto } from '../../shared/backend-services/system-notifications/system-notification.types';
import { SystemNotificationFormValue } from './system-notification-form-value';
import { toISOLocalDateTime } from '../../shared/forms/input/ngb-date-utils';

export function mapFormToDto(id: string, formValue: SystemNotificationFormValue): SystemNotificationDto {
  return {
    id: id,
    title: formValue.title,
    text_de: formValue.text_de,
    text_fr: formValue.text_fr,
    text_it: formValue.text_it,
    text_en: formValue.text_en,
    type: formValue.type,
    startDate: toISOLocalDateTime(formValue.startDate, formValue.startTimeHours, formValue.startTimeMinutes),
    endDate: toISOLocalDateTime(formValue.endDate, formValue.endTimeHours, formValue.endTimeMinutes),
    active: formValue.active
  };
}
