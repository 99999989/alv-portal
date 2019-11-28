import { loginAsKkEditor } from '../auth';
import { CompetenceSetsOverviewPo } from './pages/competence-sets-overview-po';

function createKkSet() {

}

function deleteKkSet() {

}

describe('Not linked kk-sets, linked kk-elements', () => {
  let competenceSetsOverviewPo = new CompetenceSetsOverviewPo();

  beforeAll(() => {
    loginAsKkEditor();
  });

  it('should navigate to the kk set overview page', () => {
  });

  it('should get 0 results when search something that doesnt exist', () => {
  });

  it('should csrud kk-set that is not linked to any fiche', () => {
  });

  it('should not allowed to create set without know-how linked', () => {
  });

  describe('CSRUD', () => {
    beforeEach(createKkSet);
    it('should search created kk-set', () => {
    });
    it('should show backlinks for kk-elements that are linked to kk-set', () => {
    });
    it('should not allow to delete kk-elements that are linked to kk-set', () => {
    });
    it('should allow editing and search for the updated set', () => {
    });
    afterEach(deleteKkSet);
  });

});
