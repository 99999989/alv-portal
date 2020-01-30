import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';

export enum CompetenceType {
  BASIC = 'BASIC',
  SPECIALIST = 'SPECIALIST'
}

export enum BusinessExceptionTypes {
  CANNOT_DELETE_KNOW_HOW_REFERENCED_IN_COMPETENCE_SET = 'CANNOT_DELETE_KNOW_HOW_REFERENCED_IN_COMPETENCE_SET',
  CANNOT_DELETE_PREREQUISITE_REFERENCED_IN_CH_FICHE = 'CANNOT_DELETE_PREREQUISITE_REFERENCED_IN_CH_FICHE',
  CANNOT_DELETE_WORK_ENVIRONMENT_REFERENCED_IN_CH_FICHE = 'CANNOT_DELETE_WORK_ENVIRONMENT_REFERENCED_IN_CH_FICHE',
  GENERAL_BUSINESS_EXCEPTION = 'GENERAL_BUSINESS_EXCEPTION',
  BFS_CODE_ALREADY_REFERENCED_IN_CH_FICHE = 'BFS_CODE_ALREADY_REFERENCED_IN_CH_FICHE',
  CANNOT_PUBLISH_COMPETENCE_SET_WHEN_KNOW_HOW_IS_NOT_PUBLISHED = 'CANNOT_PUBLISH_COMPETENCE_SET_WHEN_KNOW_HOW_IS_NOT_PUBLISHED',
  CANNOT_UNPUBLISH_KNOW_HOW_REFERENCED_IN_A_PUBLISHED_COMPETENCE_SET = 'CANNOT_UNPUBLISH_KNOW_HOW_REFERENCED_IN_A_PUBLISHED_COMPETENCE_SET',
  CANNOT_PUBLISH_DRAFT = 'CANNOT_PUBLISH_DRAFT',
  CANNOT_DELETE_IN_STATUS_PUBLISHED = 'CANNOT_DELETE_IN_STATUS_PUBLISHED'
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
  workEnvironmentIds: string[];

}

export interface CreateChFiche {
  title?: TranslatedString;
  description?: TranslatedString;
  occupations: Occupation[];
  competences: Competence[];
  draft?: boolean;
  published?: boolean;
  prerequisiteIds: string[];
  workEnvironmentIds: string[];
}

export interface UpdateChFiche {
  title?: TranslatedString;
  description?: TranslatedString;
  occupations: Occupation[];
  competences: Competence[];
  draft?: boolean;
  published?: boolean;
  prerequisiteIds: string[];
  workEnvironmentIds: string[];
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
    workEnvironmentIds: [],
  };
}
