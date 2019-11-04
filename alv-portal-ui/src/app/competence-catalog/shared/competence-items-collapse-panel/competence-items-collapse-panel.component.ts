import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { collapseExpandAnimation } from '../../../shared/animations/animations';
import {
  CompetenceCatalogAction
} from '../shared-competence-catalog.types';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';

@Component({
  selector: 'alv-competence-items-collapse-panel',
  templateUrl: './competence-items-collapse-panel.component.html',
  styleUrls: ['./competence-items-collapse-panel.component.scss'],
  animations: [collapseExpandAnimation]
})
export class CompetenceItemsCollapsePanelComponent implements OnInit {

  @Input() id: string;

  @Input() label: string;

  @Input() isCollapsed = true;

  @Input() isEmpty: boolean;

  @Input() darkMode: boolean;

  @Input() showActionButtons: boolean;

  @Input() actions: ActionDefinition<CompetenceCatalogAction>[];

  @Output() actionClick = new EventEmitter<CompetenceCatalogAction>();

  @Output() toggleClick = new EventEmitter<boolean>();

  a11yId = this.id;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleClick.emit(this.isCollapsed);
  }

}
