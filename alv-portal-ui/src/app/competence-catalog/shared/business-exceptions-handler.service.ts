import { Injectable } from '@angular/core';
import { BusinessExceptionTypes } from '../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { NotificationsService } from '../../core/notifications.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';

export interface BusinessExceptionToNotification {
  exception: BusinessExceptionTypes;
  notification: string;
}

export const defaultExceptionToNotificationMap: BusinessExceptionToNotification[] = [
  {
    exception: BusinessExceptionTypes.CANNOT_PUBLISH_DRAFT,
    notification: 'portal.competence-catalog.business-error-messages.cannot_publish_draft'
  },
  {
    exception: BusinessExceptionTypes.CANNOT_DELETE_IN_STATUS_PUBLISHED,
    notification: 'portal.competence-catalog.business-error-messages.cannot_delete_in_status_published'
  },
  {
    exception: BusinessExceptionTypes.CANNOT_UNPUBLISH_KNOW_HOW_REFERENCED_IN_A_PUBLISHED_COMPETENCE_SET,
    notification: 'portal.competence-catalog.business-error-messages.cannot_unpublish_know_how_referenced_in_a_published_competence_set'
  },
  {
    exception: BusinessExceptionTypes.CANNOT_PUBLISH_COMPETENCE_SET_WHEN_KNOW_HOW_IS_NOT_PUBLISHED,
    notification: 'portal.competence-catalog.business-error-messages.cannot_publish_competence_set_when_know_how_is_not_published'
  },
  {
    exception: BusinessExceptionTypes.BFS_CODE_ALREADY_REFERENCED_IN_CH_FICHE,
    notification: 'portal.competence-catalog.business-error-messages.bfs_code_already_referenced_in_ch_fiche'
  },
  {
    exception: BusinessExceptionTypes.GENERAL_BUSINESS_EXCEPTION,
    notification: 'portal.competence-catalog.business-error-messages.general_business_exception'
  },
  {
    exception: BusinessExceptionTypes.CANNOT_DELETE_KNOW_HOW_REFERENCED_IN_COMPETENCE_SET,
    notification: 'portal.competence-catalog.business-error-messages.cannot_delete_know_how_referenced_in_competence_set'
  },
  {
    exception: BusinessExceptionTypes.CANNOT_DELETE_PREREQUISITE_REFERENCED_IN_CH_FICHE,
    notification: 'portal.competence-catalog.business-error-messages.cannot_delete_prerequisite_referenced_in_ch_fiche'
  },
  {
    exception: BusinessExceptionTypes.CANNOT_DELETE_WORK_ENVIRONMENT_REFERENCED_IN_CH_FICHE,
    notification: 'portal.competence-catalog.business-error-messages.cannot_delete_work_environment_referenced_in_ch_fiche'
  }
];

let a: keyof typeof BusinessExceptionTypes;
a = 'BFS_CODE_ALREADY_REFERENCED_IN_CH_FICHE';

@Injectable({
  providedIn: 'root'
})
export class BusinessExceptionsHandlerService {

  constructor(private notificationsService: NotificationsService) {
  }

  handleError(error: HttpErrorResponse, exceptionsToNotifications: BusinessExceptionToNotification[] = defaultExceptionToNotificationMap): Observable<never> {
    const matchedPair = exceptionsToNotifications.find(pair => error.error['business-exception-type'] === pair.exception);
    if (!matchedPair) {
      return throwError(error);
    } else {
      this.notificationsService.error(matchedPair.notification);
      return EMPTY;
    }
  }

}
