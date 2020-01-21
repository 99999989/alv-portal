import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';

export enum WorkEnvironmentType {
  SECTOR = 'SECTOR',
  WORK_SETTING = 'SETTING',
  WORK_CONDITION = 'CONDITION'
}

export interface WorkEnvironment {
  id: string;
  draft: boolean;
  published: boolean;
  description: TranslatedString;
}

export interface CreateWorkEnvironment {
  description: TranslatedString;
}

export interface UpdateWorkEnvironment {
  draft: boolean;
  published: boolean;
  description: TranslatedString;
}
