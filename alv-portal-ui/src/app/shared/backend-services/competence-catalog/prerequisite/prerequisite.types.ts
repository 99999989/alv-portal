import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';
import { CompetenceItem } from '../competence-item.types';


export interface Prerequisite extends CompetenceItem {
  id: string;
  description: TranslatedString;
}

export interface CreatePrerequisite {
  description: TranslatedString;
}

export interface UpdatePrerequisite {
  draft: boolean;
  published: boolean;
  description: TranslatedString;
}
