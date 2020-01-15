import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';


export interface Prerequisite {
  id: string;
  draft: boolean;
  published: boolean;
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
