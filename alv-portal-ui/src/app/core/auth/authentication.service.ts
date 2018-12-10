import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RegistrationStatus, User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { CoreState, getCurrentUser } from '../state-management/state/core.state.ts';
import {
  LoadCurrentUserAction,
  LogoutUserAction
} from '../state-management/actions/core.actions';
import { filter, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly currentUser$: Observable<User>;

  constructor(private httpClient: HttpClient,
              private store: Store<CoreState>) {
    this.currentUser$ = this.store.pipe(select(getCurrentUser));
  }

  init() {
    this.store.dispatch(new LoadCurrentUserAction({}));
  }

  reloadCurrentUser() {
    // TODO we should find a better solution that we wait until the currentUser has changed / was fetched from the backend
    this.store.dispatch(new LoadCurrentUserAction({}));
    return this.getCurrentUser().pipe(
      filter((user) => !!user),
      take(1));
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser$;
  }

  localLogin(credentials: Credentials) {
    return this.httpClient.post<User>('/api/authenticate', credentials, { observe: 'response' }).pipe(
      switchMap(response => {
        this.store.dispatch(new LoadCurrentUserAction({ jwt: response.headers.get('Authorization') }));
        return this.getCurrentUser().pipe(
          filter((user) => !!user),
          take(1));
      })
    );
  }

  logout(): void {
    this.store.dispatch(new LogoutUserAction({}));
  }

  isAuthenticated(): boolean {
    // TODO
    return false;
  }

}

export class UserDto {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  langKey: string;
  authorities: Array<string>;
  registrationStatus: RegistrationStatus;
}


export interface Credentials {
  username: string;
  password: string;
  rememberMe: boolean;
}
