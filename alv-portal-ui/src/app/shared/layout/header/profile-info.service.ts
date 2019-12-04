import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import {
  CoreState,
  getProfileInfo,
  notFetched
} from '../../../core/state-management/state/core.state.ts';
import { LoadProfileInfoAction } from '../../../core/state-management/actions/core.actions';

@Injectable({
  providedIn: 'root'
})
export class ProfileInfoService {

  private profileInfo$;

  constructor(private httpClient: HttpClient,
              private store: Store<CoreState>) {

    this.profileInfo$ = this.store.pipe(
      select(getProfileInfo),
      skipWhile(notFetched)
    );
  }

  init() {
    this.store.dispatch(new LoadProfileInfoAction({}));
  }

  getProfileInfo(): Observable<ProfileInfo> {
    return this.profileInfo$;
  }
}


export interface ProfileInfoResource {
  activeProfiles: string[];
  ribbonEnv: string;
}

export interface ProfileInfo {
  activeProfiles: string[];
  ribbonEnv: string;
  inProduction: boolean;
  swaggerEnabled: boolean;
  noEiam: boolean;
}
