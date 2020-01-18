import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { JobAdSearchProfileResult } from '../../backend-services/job-ad-search-profiles/job-ad-search-profiles.types';

@Component({
  selector: 'alv-search-profile-item',
  templateUrl: './search-profile-item.component.html',
  styleUrls: ['./search-profile-item.component.scss']
})
export class SearchProfileItemComponent {

  @Input() baseRouterLink: string; // e.g. '/job-search'

  @Input() searchProfile: JobAdSearchProfileResult;

  @Output() deleted = new EventEmitter<JobAdSearchProfileResult>();

  @Output() enabledJobAlert = new EventEmitter<JobAdSearchProfileResult>();

  constructor() {
  }

  deleteProfile(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.deleted.emit(this.searchProfile);
  }

  enableJobAlert(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.enabledJobAlert.emit(this.searchProfile);
  }

}
