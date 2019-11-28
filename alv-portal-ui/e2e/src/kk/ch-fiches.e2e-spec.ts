import { loginAsKkEditor } from '../auth';
import { ChFichesOverviewPo } from './pages/ch-fiches-overview-po';

function createChFiche() {

}

function deleteChFiche() {

}

describe('CH-fiches, linked kk-sets', () => {
  let chFichesOverviewPo = new ChFichesOverviewPo();

  beforeAll(() => {
    loginAsKkEditor();
  });

  it('should navigate to the ch fiche overview page', () => {
  });

  it('should get 0 results when search something that doesnt exist', () => {
  });

  it('should not allowed to create fiche without mandatory fields', () => {
  });

  describe('CSRUD', () => {
    beforeEach(createChFiche);
    it('should search created ch-fiche by occupation', () => {
    });
    it('should search created ch-fiche by fiche title', () => {
    });
    it('should show backlinks for the sets that are linked to the given ch-fiche', () => {
    });
    it('should not allow to delete kk-sets that are linked to kk-fiche', () => {
    });
    it('should allow editing and search for the updated fiche', () => {
    });
    afterEach(deleteChFiche);
  });


});
