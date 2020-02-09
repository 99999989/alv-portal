import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';
import { CompetenceItem } from '../competence-item.types';

export enum WorkEnvironmentType {
  SECTOR = 'SECTOR',
  ENVIRONMENT = 'ENVIRONMENT',
  CONDITION = 'CONDITION'
}

export interface WorkEnvironment extends CompetenceItem {
  id: string;
  type: WorkEnvironmentType;
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
