import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { I18nService } from '../../../core/i18n.service';
import { ActionDefinition } from '../../../shared/backend-services/shared.types';
import {
  CompetenceCatalogAction, getTranslatedString, TranslatedString,
  TranslatedStringToCurrentLanguage
} from '../shared-competence-catalog.types';

@Component({
  selector: 'alv-competence-item',
  templateUrl: './competence-item.component.html',
  styleUrls: ['./competence-item.component.scss']
})
export class CompetenceItemComponent implements OnInit {

  @Input() superTitle: string;

  @Input() type: string;

  @Input() isItemClickable: boolean;

  @Input() showActionButtons: boolean;

  @Input() actions: ActionDefinition<CompetenceCatalogAction>[];

  @Output() itemClick = new EventEmitter<void>();

  @Output() actionClick = new EventEmitter<CompetenceCatalogAction>();

  translatedTitle$: Observable<TranslatedStringToCurrentLanguage>;

  constructor(private i18nService: I18nService) {
  }

  private _multiLanguageTitle: TranslatedString;

  get multiLanguageTitle(): TranslatedString {
    return this._multiLanguageTitle;
  }

  @Input()
  set multiLanguageTitle(value: TranslatedString) {
    this._multiLanguageTitle = value;
    this.setMultiLanguageTitle();
  }

  ngOnInit() {
  }

  onItemClick() {
    this.itemClick.emit();
  }

  onActionClick(action: CompetenceCatalogAction) {
    this.actionClick.emit(action);
  }

  private setMultiLanguageTitle() {
    this.translatedTitle$ = this.i18nService.currentLanguage$.pipe(
      map(lang => getTranslatedString(this.multiLanguageTitle, lang))
    );
  }

}
