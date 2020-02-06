import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';

export enum WorkEnvironmentType {
  SECTOR = 'SECTOR',
  ENVIRONMENT = 'ENVIRONMENT',
  CONDITION = 'CONDITION'
}

export interface WorkEnvironment {
  id: string;
  type: WorkEnvironmentType;
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
