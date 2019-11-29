import { loginAsKkEditor } from '../auth';
import { CompetenceElementsOverviewPo } from './pages/competence-elements-overview-po';
import { browser } from 'protractor';

function createKkElement() {

}

function deleteKkElement() {

}

fdescribe('not linked KK-elements creation and search', () => {
  let competenceElementsOverviewPo = new CompetenceElementsOverviewPo();

  beforeAll(() => {
    browser.get('/kk');
    loginAsKkEditor();
  });

  fit('should navigate to the kk elements overview page', () => {
    browser.pause();
    browser.debugger();
  });

  it('should switch between sorting modes', () => {
    // here we suppose that we have some kk-elements in the db. It makes sense to create
    // a function that creates a lot of kk-elements.
  });

  it('should get 0 results when search something that doesnt exist', () => {
  });

  it('should perform filtering by type', () => {
  });

  describe('CSRUD', () => {
    beforeEach(createKkElement);
    it('should allow to search for the created kk-element', () => {
    });
    it('should allow editing the existing kk-element and search the result', () => {
    });
    afterEach(deleteKkElement);
  });


});
