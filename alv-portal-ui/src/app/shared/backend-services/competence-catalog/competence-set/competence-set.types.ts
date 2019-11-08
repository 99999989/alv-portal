import { CompetenceElement } from '../competence-element/competence-element.types';

export interface CompetenceSet {
  id: string;
  draft: boolean;
  published: boolean;
  knowHowId: string;
  competenceElementIds: string[];
}

export interface CreateCompetenceSet {
  knowHowId: string;
  competenceElementIds: string[];
}

export interface UpdateCompetenceSet {
  draft: boolean;
  published: boolean;
  knowHowId: string;
  competenceElementIds: string[];
}

export interface CompetenceSetSearchResult {
  id: string;
  draft: boolean;
  published: boolean;
  knowHow: CompetenceElement;
  competenceElementIds: string[];
}

export const initialCompetenceSet = () => {
  return {
    competenceElementIds: []
  };
};
