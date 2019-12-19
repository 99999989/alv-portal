import { JobPublicationPo } from './job-publication.po';
import { browser, Key } from 'protractor';
import { getSelectOptions } from './selector-utils';
import { DEFAULT_SLEEP_TIME, SHORT_SLEEP_TIME } from '../../constants';

describe('Job publication page', () => {
  let page: JobPublicationPo;

  beforeEach(() => {
    page = new JobPublicationPo();
  });

  it('should navigate to the job-publication page', () => {
    page.navigateTo();
    expect(page.browserTitle).toEqual('Post job');
  });

  it('should initialize the title with the url parameter value', () => {
    expect(page.jobDescriptionSection.jobTitle.getAttribute('value')).toEqual('test-job-title');
  });

  describe('happy path', () => {
    const testTextPrefix = `protractor_${Math.random().toString(36).substr(2, 5)}`;

    it('should submit a valid job publication form', () => {
      page.selectDeLanguage.click();

      page.jobDescriptionSection.numberOfJobs.sendKeys('3');
      page.jobDescriptionSection.jobDescription.sendKeys(testTextPrefix + ' description');

      page.occupationSection.occupation.sendKeys('Met');
      browser.sleep(SHORT_SLEEP_TIME);
      page.occupationSection.occupation.sendKeys(Key.TAB);
      getSelectOptions(page.occupationSection.qualification).last().click();
      getSelectOptions(page.occupationSection.degree).last().click();
      getSelectOptions(page.occupationSection.experience).last().click();

      page.languages.languageIsoCodes.then(languageIsoCodes => expect(languageIsoCodes.length).toEqual(1));
      page.languages.spokenLevels.then(spokenLevels => expect(spokenLevels.length).toEqual(0));
      page.languages.writtenLevels.then(writtenLevels => expect(writtenLevels.length).toEqual(0));
      getSelectOptions(page.languages.languageIsoCodes.first()).last().click();
      page.languages.spokenLevels.then(spokenLevels => expect(spokenLevels.length).toEqual(1));
      page.languages.writtenLevels.then(writtenLevels => expect(writtenLevels.length).toEqual(1));


      expect(page.location.countryIsoCode.getAttribute('value')).toMatch(/\d:\sCH/);
      page.location.zipCityAutoComplete.sendKeys('8047');
      browser.sleep(SHORT_SLEEP_TIME);
      page.location.zipCityAutoComplete.sendKeys(Key.TAB);
      expect(page.location.zipCityAutoComplete.getAttribute('value')).toEqual('8047 Zürich');
      page.location.remarks.sendKeys(testTextPrefix + ' location remarks');


      page.company.name.sendKeys(testTextPrefix + ' company name');
      page.company.street.sendKeys(testTextPrefix + ' company street');
      page.company.houseNumber.sendKeys('42');
      page.company.zipCityAutoComplete.sendKeys('8047');
      browser.sleep(SHORT_SLEEP_TIME);
      page.company.zipCityAutoComplete.sendKeys(Key.TAB);
      page.company.postOfficeBoxNumber.sendKeys('24');
      expect(page.company.countryIsoCode.getAttribute('value')).toMatch(/\d:\sCH/);


      expect(page.contact.languageIsoCode.getAttribute('value')).toMatch(/\d:\sen/);
      getSelectOptions(page.contact.salutation).last().click();
      page.contact.firstName.sendKeys(testTextPrefix + ' contact first name');
      page.contact.lastName.sendKeys(testTextPrefix + ' contact last name');
      page.contact.phone.sendKeys('555555555');
      page.contact.email.sendKeys(testTextPrefix + '@email.ch');


      page.publicContact.btnCopy.sendKeys(Key.ENTER);
      browser.sleep(SHORT_SLEEP_TIME);
      expect(page.publicContact.salutation.getAttribute('value')).toEqual(page.contact.salutation.getAttribute('value'));
      expect(page.publicContact.firstName.getAttribute('value')).toEqual(page.contact.firstName.getAttribute('value'));
      expect(page.publicContact.lastName.getAttribute('value')).toEqual(page.contact.lastName.getAttribute('value'));
      expect(page.publicContact.phone.getAttribute('value')).toEqual(page.contact.phone.getAttribute('value'));
      expect(page.publicContact.email.getAttribute('value')).toEqual(page.contact.email.getAttribute('value'));


      expect(page.application.formUrl.isPresent()).toBe(false);
      page.application.form.click();
      expect(page.application.formUrl.isPresent()).toBe(true);
      page.application.formUrl.sendKeys('http://test.form.ch');
      page.application.additionalInfo.sendKeys(testTextPrefix + ' application additional info');


      page.disclaimer.click();


      page.btnSubmit.sendKeys(Key.ENTER);
      browser.sleep(DEFAULT_SLEEP_TIME);
      //FIXME we have to investigate why this check fails randomly. Network related?
      expect(page.jobPublicationForm.isPresent()).toBe(false);
      expect(page.successMessage.isPresent()).toBe(true);
    });
  });
});
