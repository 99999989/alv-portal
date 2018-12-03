import { Component, Input } from '@angular/core';
import { Location } from '../../shared/backend-services/job-advertisement/job-advertisement.model';

@Component({
  selector: 'alv-job-location',
  template: `
    <span *ngIf="location"
          class="badge badge-blue">
            {{ location.postalCode }} {{ location.city }}
      <ng-container *ngIf="location.cantonCode || location.countryIsoCode">
                ({{ location.cantonCode || location.countryIsoCode }})
            </ng-container>
        </span>
  `,
})
export class JobLocationComponent {

  @Input()
  location: Location;


}
