import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { RightsAwareComponent } from '../rights-aware/rights-aware.component';

@Component({
  selector: 'alv-overview',
  template: '',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent extends RightsAwareComponent implements OnInit {

  sortAsc = true;

  constructor(protected authenticationService: AuthenticationService,
  ) {
    super(authenticationService);
  }

  onSortClick() {
    this.sortAsc = !this.sortAsc;
    this.reload();
  }

  reload() {
    throw new Error('You are not supposed to call this directly from OverviewComponent,' +
      ' you need to implement your version of reload');
  }

}
