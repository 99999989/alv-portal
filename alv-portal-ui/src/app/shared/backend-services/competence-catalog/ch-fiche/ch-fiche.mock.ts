import { ChFiche, CompetenceType } from './ch-fiche.types';

export const mockChFiche: ChFiche = {
  competences: [{
    competenceSetId: 'someid',
    type: CompetenceType.BASIC
  }],
  description: {
    de: 'ficheDeDescr',
    en: 'ficheEnDescr',
    fr: 'ficheFrDescr',
    it: 'ficheFrDescr'
  },
  draft: false,
  id: 'chficheid',
  occupations: [{ bfsCode: 'bfsmock', chIsco5: 'chiscomock' }],
  published: false,
  prerequisiteIds: [
    'req1',
    'req2'
  ],
  title: {
    de: 'ficheDeTitle',
    en: 'ficheEnTitle',
    fr: 'ficheFrTitle',
    it: 'ficheItTitle'
  },
  workEnvironmentIds: []
};
