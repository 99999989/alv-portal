import { Component, OnInit } from '@angular/core';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/auth/authentication.service';

@Component({
  selector: 'alv-overview',
  template: '',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent extends AbstractSubscriber implements OnInit {

  isCompetenceCatalogEditor$: Observable<boolean>;

  constructor(protected authenticationService: AuthenticationService,
  ) {
    super();
  }

  ngOnInit() {
    this.isCompetenceCatalogEditor$ = this.authenticationService.getCurrentUser().pipe(
      map(user => user && user.isCompetenceCatalogEditor())
    );
  }

}
