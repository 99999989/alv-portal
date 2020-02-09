import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';
import { CompetenceItem } from '../competence-item.types';

export enum ElementType {
  KNOW_HOW = 'KNOW_HOW',
  KNOW_HOW_INDICATOR = 'KNOW_HOW_INDICATOR',
  KNOWLEDGE = 'KNOWLEDGE'
}

export interface CompetenceElement extends CompetenceItem {
  id: string;
  type: ElementType;
  description: TranslatedString;
}

export interface CreateCompetenceElement {
  type: ElementType;
  description: TranslatedString;
}

export interface UpdateCompetenceElement {
  draft: boolean;
  published: boolean;
  description: TranslatedString;
}
