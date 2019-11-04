import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IconKey } from '../../../shared/icons/custom-icon/custom-icon.component';

@Component({
  selector: 'alv-competence-item-placeholder',
  templateUrl: './competence-item-placeholder.component.html',
  styleUrls: ['./competence-item-placeholder.component.scss']
})
export class CompetenceItemPlaceholderComponent implements OnInit {

  @Input()
  mainText: string;
  @Input()
  showErrors: boolean;
  @Input()
  icon: IconProp;
  @Input()
  customIcon: IconKey;
  @Output()
  clickHandler = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

}
