import { Injectable } from '@angular/core';

import * as jwt_decode from 'jwt-decode';
import { CoreState } from '../../state-management/state/core.state.ts';
import { Store } from '@ngrx/store';
import { SessionExpiredAction } from '../../state-management/actions/core.actions';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  static readonly TOKEN_NAME = 'authenticationToken';

  private timeout;

  constructor(private store: Store<CoreState>) {
  }

  setToken(token: string): void {
    sessionStorage.setItem(SessionManagerService.TOKEN_NAME, token);
    if (!environment.test) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(
        () => {
          return this.store.dispatch(new SessionExpiredAction({}));
        },
        this.calculateSessionTimeout(jwt_decode(token))
      );
    }
  }

  clearToken(): void {
    sessionStorage.removeItem(SessionManagerService.TOKEN_NAME);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  getToken(): string {
    return sessionStorage.getItem(SessionManagerService.TOKEN_NAME);
  }

  private calculateSessionTimeout(jwtToken: JwtToken): number {
    if (jwtToken.exp === undefined) {
      throw new Error('jwt-Token must have a \'exp\' attribute');
    }
    const expiryTime = new Date(jwtToken.exp * 1000).getTime();
    const currentTime = Date.now();
    return Math.max(expiryTime - currentTime, 0);
  }
}

interface JwtToken {
  exp: number;
}
