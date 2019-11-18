import { Languages } from '../../core/languages.constants';
import { ElementType } from '../../shared/backend-services/competence-catalog/competence-element/competence-element.types';

export interface TranslatedString {
  de: string;
  fr: string;
  it: string;
  en: string;
}

export interface TranslatedStringToCurrentLanguage {
  value: string;
  isWrongLanguage: boolean;
}

export interface CompetenceElementFilterValues {
  types: ElementType[];
}

/*
 * Get description in the next available language if current language is not available
 */
function getNextAvailableTitle(multiLanguageTitle: TranslatedString): string {
  for (const lang of Object.values(Languages)) {
    const description = findStringForLanguage(multiLanguageTitle, lang);
    if (description) {
      return description;
    }
  }
}

export function getTranslatedString (description: TranslatedString, lang: string): TranslatedStringToCurrentLanguage {
  const translatedString = findStringForLanguage(description, lang);
  if (!translatedString) {
    return {
      isWrongLanguage: true,
      value: getNextAvailableTitle(description)
    };
  }
  return {
    isWrongLanguage: false,
    value: translatedString
  };
}

function findStringForLanguage (description: TranslatedString, lang: string) {
  return description[lang];
}

export enum CompetenceCatalogAction {
  LINK = 'LINK',
  BACKLINK = 'BACKLINK',
  UNLINK = 'UNLINK',
  EDIT = 'EDIT',
  DELETE = 'DELETE'
}

export interface CompetenceCatalogSortValue {
  type: SortType;
  icon: SortIcon;
}

export enum SortType {
  DATE_DESC = 'DATE_DESC',
  DATE_ASC = 'DATE_ASC',
  ALPHA_DESC = 'ALPHA_DESC',
  ALPHA_ASC = 'ALPHA_ASC'
}

export enum SortIcon {
  NUMERIC_DOWN = 'sort-numeric-down',
  NUMERIC_UP = 'sort-numeric-up',
  ALPHA_ASC = 'sort-alpha-down',
  ALPHA_DESC = 'sort-alpha-up'
}
