import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';


export interface Requirement {
  id: string;
  draft: boolean;
  published: boolean;
  description: TranslatedString;
}

export interface CreateRequirement {
  description: TranslatedString;
}

export interface UpdateRequirement {
  draft: boolean;
  published: boolean;
  description: TranslatedString;
}
