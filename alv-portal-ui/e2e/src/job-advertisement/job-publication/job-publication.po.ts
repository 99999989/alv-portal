import { $, browser } from 'protractor';
import { JobDescriptionPo } from './sections/job-description.po';
import { OccupationPo } from './sections/occupation.po';
import { LanguagesPo } from './sections/languages.po';
import { EmploymentPo } from './sections/employment.po';
import { LocationPo } from './sections/location.po';
import { CompanyPo } from './sections/company.po';
import { ContactPo } from './sections/contact.po';
import { PublicContactPo } from './sections/public-contact.po';
import { ApplicationPo } from './sections/application.po';
import { alvFormControlName, getByTest } from './selector-utils';

export class JobPublicationPo {
  private jobPublicationComponentElementFinder = $('alv-job-publication');

  jobDescriptionSection = new JobDescriptionPo();
  occupationSection = new OccupationPo();
  languages = new LanguagesPo();
  employment = new EmploymentPo();
  location = new LocationPo();
  company = new CompanyPo();
  contact = new ContactPo();
  publicContact = new PublicContactPo();
  application = new ApplicationPo();

  navigateTo() {
    return browser.get('/job-publication?job-title=test-job-title');
  }

  get browserTitle() {
    return browser.getTitle();
  }

  get selectDeLanguage() {
    return $(getByTest('language-switcher-de'));
  }

  get jobPublicationForm() {
    return this.jobPublicationComponentElementFinder.$('alv-job-publication-form');
  }

  get successMessage() {
    return this.jobPublicationComponentElementFinder.$$('alv-alert').first().$('.notification.success');
  }

  get disclaimer() {
    return this.jobPublicationForm.$(alvFormControlName('disclaimer')).$('input');
  }

  get btnSubmit() {
    return this.jobPublicationForm.$$('button.btn-primary').last();
  }
}

