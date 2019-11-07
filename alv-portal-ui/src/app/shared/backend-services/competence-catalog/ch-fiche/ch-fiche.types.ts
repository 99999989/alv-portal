import { TranslatedString } from '../../../../competence-catalog/shared/shared-competence-catalog.types';

export enum CompetenceType {
  BASIC = 'BASIC',
  SPECIALIST = 'SPECIALIST'
}

export interface ChFiche extends UpdateChFiche {
  id: string;
}

export interface CreateChFiche {
  title: TranslatedString;
  description: TranslatedString;
  occupations: Occupation[];
  competences: Competence[];
}

export interface UpdateChFiche extends CreateChFiche {
  draft: boolean;
  published: boolean;
}

export interface Occupation {
  bfsCode: string;
  chIsco5?: string;
}

export interface Competence {
  type: CompetenceType;
  competenceSetId: string;
}

export const initialChFiche = () => {
  return {
    occupations: [],
    competences: []
  };
};
