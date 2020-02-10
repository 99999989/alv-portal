import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';
import { CompetenceItem } from '../competence-item.types';


export interface Softskill extends CompetenceItem {
  id: string;
  description: TranslatedString;
}

export interface CreateSoftskill {
  description: TranslatedString;
}

export interface UpdateSoftskill {
  draft: boolean;
  published: boolean;
  description: TranslatedString;
}
