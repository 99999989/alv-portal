import { Component, OnInit } from '@angular/core';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { RightsAwareComponent } from '../rights-aware/rights-aware.component';

@Component({
  selector: 'alv-overview',
  template: '',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent extends RightsAwareComponent implements OnInit {

  constructor(protected authenticationService: AuthenticationService,
  ) {
    super(authenticationService);
  }

}
