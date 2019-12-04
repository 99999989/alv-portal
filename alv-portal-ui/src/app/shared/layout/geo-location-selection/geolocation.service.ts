import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  public enabled$ = new BehaviorSubject(true);

  constructor() {
  }

  public navigatorGeolocation(): Observable<Coordinates> {
    return Observable.create((observer: Subscriber<Coordinates>) => {
      if (!('geolocation' in navigator)) {
        observer.error({
          code: 99,
          message: 'geolocation not available in navigator'
        } as PositionError);
        this.enabled$.next(false);
      } else {
        navigator.geolocation.getCurrentPosition(
          (position: Position) => {
            observer.next(position.coords);
            observer.complete();
            this.enabled$.next(true);
          },
          (error: PositionError) => {
            observer.error(error);
            this.enabled$.next(false);
          }
        );
      }
    });
  }
}
