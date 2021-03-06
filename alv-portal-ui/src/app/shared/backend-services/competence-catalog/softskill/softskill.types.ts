import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';


export interface Softskill {
  id: string;
  draft: boolean;
  published: boolean;
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
