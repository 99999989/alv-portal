import { OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { map } from 'rxjs/operators';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';


export class CompetenceCatalogEditorAwareComponent extends AbstractSubscriber implements OnInit {

  isCompetenceCatalogEditor$: Observable<boolean>;

  constructor(protected authenticationService: AuthenticationService,
  ) {
    super();
  }

  ngOnInit() {
    this.isCompetenceCatalogEditor$ = this.authenticationService.getCurrentUser().pipe(
      map(user => !!user && user.isCompetenceCatalogEditor())
    );
  }

}
