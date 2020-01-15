import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';
import { Prerequisite } from '../prerequisite/prerequisite.types';

export enum CompetenceType {
  BASIC = 'BASIC',
  SPECIALIST = 'SPECIALIST'
}

export enum BusinessExceptionTypes {
  GENERAL_BUSINESS_EXCEPTION = 'GENERAL_BUSINESS_EXCEPTION',
  BFS_CODE_ALREADY_REFERENCED_IN_CH_FICHE = 'BFS_CODE_ALREADY_REFERENCED_IN_CH_FICHE'
}

// todo instead of inheritance we need to do duplication, the same way it's done in competence-set-types
//    see Jira Issue DF-1920
export interface ChFiche {
  id?: string;
  title?: TranslatedString;
  description?: TranslatedString;
  occupations: Occupation[];
  competences: Competence[];
  draft?: boolean;
  published?: boolean;
  prerequisiteIds: string[];
}

export interface CreateChFiche {
  title?: TranslatedString;
  description?: TranslatedString;
  occupations: Occupation[];
  competences: Competence[];
  draft?: boolean;
  published?: boolean;
  prerequisiteIds: Prerequisite[];
}

export interface UpdateChFiche {
  title?: TranslatedString;
  description?: TranslatedString;
  occupations: Occupation[];
  competences: Competence[];
  draft?: boolean;
  published?: boolean;
  prerequisiteIds: string[];
}

export interface Occupation {
  bfsCode: string;
  chIsco5?: string;
}

export interface Competence {
  type: CompetenceType;
  competenceSetId: string;
}

export function initialChFiche(): ChFiche {
  return {
    draft: true,
    published: false,
    occupations: [],
    competences: [],
    prerequisiteIds: [],
  };
}
