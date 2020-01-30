import { Injectable } from '@angular/core';
import { BusinessExceptionTypes } from '../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';
import { NotificationsService } from '../../core/notifications.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';

export interface BusinessExceptionToNotification {
  exception: BusinessExceptionTypes;
  notification: string;
}

export const defaultExceptionToNotificationMap: BusinessExceptionToNotification[] = [];

let a: keyof typeof BusinessExceptionTypes;
a = 'BFS_CODE_ALREADY_REFERENCED_IN_CH_FICHE';

@Injectable({
  providedIn: 'root'
})
export class BusinessExceptionsHandlerService {

  constructor(private notificationsService: NotificationsService) {
  }

  handleErrors(error: HttpErrorResponse, exceptionsToNotifications: BusinessExceptionToNotification[] = defaultExceptionToNotificationMap): Observable<never> {
    const matchedPair = exceptionsToNotifications.find(pair => error.error['business-exception-type'] === pair.exception);
    if (matchedPair) {
      this.notificationsService.error(matchedPair.notification);
      return EMPTY;
    }
    return throwError(error);
  }

}
