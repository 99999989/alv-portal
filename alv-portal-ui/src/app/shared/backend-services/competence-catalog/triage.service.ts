import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { Observable } from 'rxjs';
import { KK_EDITOR_ENDPOINT, KK_PUBLIC_ENDPOINT, KkEndpoint } from './endpoints';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TriageService {

  endpoint$: Observable<KkEndpoint>;

  constructor(private authenticationService: AuthenticationService) {
    this.endpoint$ = this.authenticationService.getCurrentUser().pipe(
      map(user => !!user && (user.isCompetenceCatalogEditor() || user.isAdmin()) ? KK_EDITOR_ENDPOINT : KK_PUBLIC_ENDPOINT)
    );
  }
}
