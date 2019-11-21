import { Component, Input } from '@angular/core';
import {
  getTranslatedString,
  TranslatedString,
  TranslatedStringToCurrentLanguage
} from '../shared-competence-catalog.types';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { I18nService } from '../../../core/i18n.service';

@Component({
  selector: 'alv-multi-language-string',
  templateUrl: './multi-language-string.component.html',
  styleUrls: ['./multi-language-string.component.scss']
})
export class MultiLanguageStringComponent {

  titleViewValue$: Observable<TranslatedStringToCurrentLanguage>;
  private titleModel: TranslatedString;

  constructor(private i18nService: I18nService) {
  }

  get multiLanguageTitle(): TranslatedString {
    return this.titleModel;
  }

  @Input()
  set multiLanguageTitle(value: TranslatedString) {
    this.titleModel = value;
    this.titleViewValue$ = this.i18nService.currentLanguage$.pipe(
      map(lang => getTranslatedString(this.multiLanguageTitle, lang))
    );
  }

}
