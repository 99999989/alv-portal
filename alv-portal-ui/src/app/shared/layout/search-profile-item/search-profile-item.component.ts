import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { SearchProfile } from '../../backend-services/shared.types';

@Component({
  selector: 'alv-search-profile-item',
  templateUrl: './search-profile-item.component.html',
  styleUrls: ['./search-profile-item.component.scss']
})
export class SearchProfileItemComponent {

  @Input() baseRouterLink: string; // e.g. '/job-search'

  @Input() searchProfile: SearchProfile;

  @Output() deleted = new EventEmitter<SearchProfile>();

  @Output() enabledJobAlert = new EventEmitter<SearchProfile>();

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
