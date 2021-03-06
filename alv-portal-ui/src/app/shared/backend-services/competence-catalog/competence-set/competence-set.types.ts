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
  draft: boolean;
  published: boolean;
}

export interface UpdateCompetenceSet {
  draft: boolean;
  published: boolean;
  knowHowId: string;
  competenceElementIds: string[];
}

export interface CompetenceSetSearchResult {
  id?: string;
  draft?: boolean;
  published?: boolean;
  knowHow: CompetenceElement | null;
  competenceElementIds: string[];
}

export function initialCompetenceSetSearchResult(): CompetenceSetSearchResult {
  return {
    knowHow: null,
    competenceElementIds: [],
    draft: true,
    published: false
  };
}
