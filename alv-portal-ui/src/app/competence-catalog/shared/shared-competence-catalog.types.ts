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
  LINK = 'LINK', //todo maybe rename to add
  BACKLINK = 'BACKLINK',
  UNLINK = 'UNLINK',
  EDIT = 'EDIT'
}


