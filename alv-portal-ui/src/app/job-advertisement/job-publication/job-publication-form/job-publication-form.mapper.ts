import {
  ApplyChannel,
  Company,
  Contact,
  CreateJobAdvertisement,
  CreateLocation,
  Employer,
  Employment,
  JobAdvertisement,
  JobDescription,
  Occupation,
  Publication,
  PublicContact,
  WebformApplyChannel,
  WebformCompany,
  WebformPostAddress,
  WorkExperience,
  Location
} from '../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { JobPublicationFormValue } from './job-publication-form-value.types';
import {
  emptyJobDescriptionFormValue,
  JobDescriptionFormValue
} from './job-description/job-description-form-value.types';
import {
  CEFR_Level,
  Degree,
  DegreeMapping,
  EmploymentDuration,
  LanguageSkill,
  Qualification,
  Salutation,
  WorkForm
} from '../../../shared/backend-services/shared.types';
import { EmploymentFormValue } from './employment/employment-form-value.types';
import { LocationFormValue } from './location/location-form-value.types';
import { CompanyFormValue } from './company/company-form-value.types';
import { PublicationFormValue } from './publication/publication-form-value.types';
import { ContactFormValue, emptyContactFormValue } from './contact/contact-form-value.types';
import { emptyPublicContactFormValue, PublicContactFormValue } from './public-contact/public-contact-form-value.types';
import { ApplicationFormValue, emptyApplicationFormValue } from './application/application-form-value.types';
import { EmployerFormValue, emptyEmployerFormValue } from './employer/employer-form-value.types';

import { PostAddressFormValue } from './post-address-form/post-address-form-value.types';
import { ZipCityFormValue } from '../../../shared/forms/input/zip-city-input/zip-city-form-value.types';
import { IsoCountryService } from '../../../shared/localities/iso-country.service';
import { LocalitySuggestionService } from '../../../shared/localities/locality-suggestion.service';
import { fromISODate, now, toISOLocalDate } from '../../../shared/forms/input/ngb-date-utils';

import { LanguagesFormValue } from './languages/languages-form-value.types';
import { emptyOccupationFormValue, OccupationFormValue } from './occupation/occupation-form-value.types';
import {
  OccupationTypeaheadItem,
  OccupationTypeaheadItemType
} from '../../../shared/occupations/occupation-typeahead-item';
import { OccupationTypes } from '../../../shared/backend-services/reference-service/occupation-label.repository';
import { CompanyContactTemplateModel } from '../../../core/auth/company-contact-template-model';
import { mapToPostalCodeAndCity } from '../../../shared/forms/input/zip-city-input/zip-city-form-mappers';


export function mapToJobPublicationFormValue(jobAdvertisement: JobAdvertisement, languageIsoCode: string): JobPublicationFormValue {
  const jobContent = jobAdvertisement.jobContent;

  return {
    jobDescription: mapToJobDescriptionFormValue(jobContent.jobDescriptions, jobContent.numberOfJobs),
    occupation: mapToOccupationFormValue(jobContent.occupations),
    languageSkills: mapToLanguagesFormValue(jobContent.languageSkills),
    employment: mapToEmploymentFormValue(jobContent.employment),
    location: mapToLocationFormValue(jobContent.location),
    company: mapCompanyToCompanyFormValue(jobContent.company),
    contact: emptyContactFormValue(languageIsoCode),
    publicContact: mapToPublicContactFormValue(jobContent.publicContact),
    surrogate: jobContent.company.surrogate,
    employer: mapToEmployerFormValue(jobContent.employer),
    application: mapToApplicationFormValue(jobContent.applyChannel),
    publication: mapToPublicationFormValue(jobAdvertisement.publication),
    disclaimer: false
  };
}

function mapToJobDescriptionFormValue(jobDescriptions: JobDescription[], numberOfJobs: string): JobDescriptionFormValue {
  if (!jobDescriptions || jobDescriptions.length === 0) {
    return emptyJobDescriptionFormValue();
  }

  const jobDescription = jobDescriptions[0];

  return {
    title: jobDescription.title,
    jobDescription: jobDescription.description,
    numberOfJobs: +numberOfJobs,
  };
}

function mapToOccupationFormValue(occupations: Occupation[]): OccupationFormValue {
  if (!occupations || occupations.length === 0) {
    return emptyOccupationFormValue();
  }

  const occupation = occupations[0];
  return {
    degree: <Degree>DegreeMapping[occupation.educationCode],
    experience: <WorkExperience>occupation.workExperience,
    qualification: <Qualification>occupation.qualificationCode,
    occupationSuggestion: new OccupationTypeaheadItem(OccupationTypeaheadItemType.OCCUPATION, {
      type: OccupationTypes.AVAM,
      value: occupation.avamOccupationCode
    }, '', 0)
  };
}

function mapToLanguagesFormValue(languageSkills: LanguageSkill[]): LanguagesFormValue {
  return languageSkills ? languageSkills.map(languageSkill => {
    languageSkill.spokenLevel = languageSkill.spokenLevel ? languageSkill.spokenLevel : CEFR_Level.NONE;
    languageSkill.writtenLevel = languageSkill.writtenLevel ? languageSkill.writtenLevel : CEFR_Level.NONE;
    return languageSkill;
  }) : [];
}

function mapToEmploymentFormValue(employment: Employment): EmploymentFormValue {
  return {
    startDate: fromISODate(employment.startDate),
    endDate: fromISODate(employment.endDate),
    immediately: employment.immediately,
    workloadPercentageMin: parseInt(employment.workloadPercentageMin.toString(), 10),
    workloadPercentageMax: parseInt(employment.workloadPercentageMax.toString(), 10),
    duration: mapToDuration(employment),
    workForms: Object.keys(WorkForm).reduce((acc, curr) => {
      acc[curr] = employment.workForms.includes(curr);
      return acc;
    }, {})
  };
}

function mapToDuration(employment: Employment): EmploymentDuration {
  if (employment.shortEmployment) {
    return EmploymentDuration.SHORT_EMPLOYMENT;
  }

  if (employment.permanent) {
    return EmploymentDuration.PERMANENT;
  }

  return EmploymentDuration.TEMPORARY;
}


function mapToLocationFormValue(location: Location): LocationFormValue {

  return {
    countryIsoCode: location.countryIsoCode,
    zipAndCity: mapToZipCityFormValue(location.countryIsoCode, location.postalCode, location.city),
    remarks: location.remarks,
  };
}

function mapCompanyToCompanyFormValue(company: Company): CompanyFormValue {
  const postalCode = company.postalCode || company.postOfficeBoxPostalCode;
  const city = company.city || company.postOfficeBoxCity;

  return {
    name: company.name,
    postOfficeBoxNumberOrStreet: {
      street: company.street,
      postOfficeBoxNumber: company.postOfficeBoxNumber
    },
    zipAndCity: mapToZipCityFormValue(company.countryIsoCode, postalCode, city),
    houseNumber: company.houseNumber,
    countryIsoCode: company.countryIsoCode
  };
}

export function mapToCompanyFormValue(companyContactTemplateModel: CompanyContactTemplateModel): CompanyFormValue {
  return {
    name: companyContactTemplateModel.companyName,
    postOfficeBoxNumberOrStreet: {
      street: companyContactTemplateModel.companyStreet,
    },
    zipAndCity: mapToZipCityFormValue(IsoCountryService.ISO_CODE_SWITZERLAND, companyContactTemplateModel.companyZipCode, companyContactTemplateModel.companyCity),
    houseNumber: companyContactTemplateModel.companyHouseNr,
    countryIsoCode: IsoCountryService.ISO_CODE_SWITZERLAND
  };
}

function mapToPublicContactFormValue(publicContact: PublicContact): PublicContactFormValue {
  if (!publicContact) {
    return emptyPublicContactFormValue();
  }

  return {
    salutation: publicContact.salutation,
    firstName: publicContact.firstName,
    lastName: publicContact.lastName,
    email: publicContact.email,
    phone: publicContact.phone
  };
}

function mapToEmployerFormValue(employer: Employer): EmployerFormValue {
  if (!employer) {
    return emptyEmployerFormValue();
  }

  return {
    name: employer.name,
    countryIsoCode: employer.countryIsoCode,
    zipAndCity: mapToZipCityFormValue(employer.countryIsoCode, employer.postalCode, employer.city)
  };
}

function mapToApplicationFormValue(applyChannel: ApplyChannel): ApplicationFormValue {
  if (!applyChannel) {
    return emptyApplicationFormValue();
  }

  const application: ApplicationFormValue = {
    selectedApplicationTypes: {
      form: false,
      email: false,
      phone: false,
      post: false
    },
    additionalInfo: applyChannel.additionalInfo
  };

  if (!!applyChannel.formUrl) {
    application.selectedApplicationTypes.form = true;
    application.formUrl = applyChannel.formUrl;
  }

  if (!!applyChannel.emailAddress) {
    application.selectedApplicationTypes.email = true;
    application.emailAddress = applyChannel.emailAddress;
  }

  if (!!applyChannel.phoneNumber) {
    application.selectedApplicationTypes.phone = true;
    application.phoneNumber = applyChannel.phoneNumber;
  }

  if (!!applyChannel.postAddress) {
    const postAddress = applyChannel.postAddress;
    application.selectedApplicationTypes.post = true;

    let zipAndCityFormValue: ZipCityFormValue;
    if (postAddress.postOfficeBoxNumber) {
      zipAndCityFormValue = mapToZipCityFormValue(postAddress.countryIsoCode, postAddress.postOfficeBoxPostalCode, postAddress.postOfficeBoxCity);
    } else {
      zipAndCityFormValue = mapToZipCityFormValue(postAddress.countryIsoCode, postAddress.postalCode, postAddress.city);
    }

    application.postAddress = {
      name: postAddress.name,
      countryIsoCode: postAddress.countryIsoCode,
      houseNumber: postAddress.houseNumber,
      postOfficeBoxNumberOrStreet: {
        street: postAddress.street,
        postOfficeBoxNumber: postAddress.postOfficeBoxNumber
      },
      zipAndCity: zipAndCityFormValue
    };
  }

  return application;
}

function mapToPublicationFormValue(publication: Publication): PublicationFormValue {
  return {
    euresDisplay: publication.euresDisplay,
    publicDisplay: publication.publicDisplay
  };
}

export function mapToContactFormValue(companyContactTemplateModel: CompanyContactTemplateModel, languageIsoCode: string): ContactFormValue {
  return {
    salutation: <Salutation>companyContactTemplateModel.salutation,
    firstName: companyContactTemplateModel.firstName,
    lastName: companyContactTemplateModel.lastName,
    email: companyContactTemplateModel.email,
    phone: companyContactTemplateModel.phone,
    languageIsoCode: languageIsoCode
  };
}

export function mapToZipCityFormValue(countryIsoCode: string, zipCode: string, city: string): ZipCityFormValue {
  const zipCity = { zipCode, city };

  if (countryIsoCode === IsoCountryService.ISO_CODE_SWITZERLAND) {
    return {
      zipCityAutoComplete: LocalitySuggestionService.toZipAndCityTypeaheadItem(zipCity, 0)
    };
  }

  return { zipCode, city };
}


export function mapToCreateJobAdvertisement(jobPublicationFormValue: JobPublicationFormValue, languageIsoCode: string): CreateJobAdvertisement {
  return {
    reportToAvam: true,
    jobDescriptions: mapToJobDescriptions(jobPublicationFormValue.jobDescription, languageIsoCode),
    numberOfJobs: jobPublicationFormValue.jobDescription.numberOfJobs.toString(),
    occupation: mapToOccupation(jobPublicationFormValue.occupation),
    languageSkills: mapToLanguageSkills(jobPublicationFormValue.languageSkills),
    employment: mapToEmployment(jobPublicationFormValue.employment),
    location: mapToLocation(jobPublicationFormValue.location),
    company: mapToCompany(jobPublicationFormValue.company, jobPublicationFormValue.surrogate),
    contact: mapToContact(jobPublicationFormValue.contact),
    publicContact: mapToPublicContact(jobPublicationFormValue.publicContact),
    publication: mapToPublication(jobPublicationFormValue.publication),
    applyChannel: mapToApplyChannel(jobPublicationFormValue.application),
    employer: mapToEmployer(jobPublicationFormValue.employer),
  };
}


function mapToJobDescriptions(jobDescriptionFormValue: JobDescriptionFormValue, languageIsoCode: string): JobDescription[] {
  const jobDescription = {
    title: jobDescriptionFormValue.title,
    description: jobDescriptionFormValue.jobDescription,
    languageIsoCode
  };

  return [jobDescription];
}

function mapToOccupation(occupationFormValue: OccupationFormValue): Occupation {
  return {
    avamOccupationCode: occupationFormValue.occupationSuggestion.payload.value,
    qualificationCode: occupationFormValue.qualification,
    workExperience: occupationFormValue.experience,
    educationCode: occupationFormValue.degree
      ? Degree[occupationFormValue.degree]
      : null,
  };
}

function mapToLanguageSkills(languageSkills: LanguageSkill[]): LanguageSkill[] {
  return languageSkills.filter((languageSkill) => !!languageSkill.languageIsoCode);
}

function mapToEmployment(employmentFormValue: EmploymentFormValue): Employment {
  return {
    immediately: employmentFormValue.immediately,
    shortEmployment: employmentFormValue.duration === EmploymentDuration.SHORT_EMPLOYMENT,
    permanent: employmentFormValue.duration === EmploymentDuration.PERMANENT,
    workForms: mapToWorkForms(employmentFormValue.workForms),
    workloadPercentageMin: employmentFormValue.workloadPercentageMin,
    workloadPercentageMax: employmentFormValue.workloadPercentageMax,
    startDate: toISOLocalDate(employmentFormValue.startDate),
    endDate: toISOLocalDate(employmentFormValue.endDate),
  };
}

function mapToWorkForms(workFormsFormValue: { [p: string]: boolean }): string[] {
  return Object.keys(workFormsFormValue)
    .filter((workFormKey) => workFormsFormValue[workFormKey])
    .map((workFormKey) => WorkForm[workFormKey]);
}

function mapToLocation(locationFormValue: LocationFormValue): CreateLocation {
  return {
    remarks: locationFormValue.remarks,
    ...mapToPostalCodeAndCity(locationFormValue.zipAndCity),
    countryIsoCode: locationFormValue.countryIsoCode
  };
}

function mapToCompany(companyFormValue: CompanyFormValue, surrogate: boolean): WebformCompany {

  const postOfficeBoxNumber = companyFormValue.postOfficeBoxNumberOrStreet.postOfficeBoxNumber;

  return {
    surrogate,
    name: companyFormValue.name,
    street: companyFormValue.postOfficeBoxNumberOrStreet.street,
    houseNumber: companyFormValue.houseNumber,
    ...mapToPostalCodeAndCity(companyFormValue.zipAndCity),
    countryIsoCode: companyFormValue.countryIsoCode,
    postOfficeBoxNumber
  };
}

function mapToEmployer(employerFormValue: EmployerFormValue): Employer {
  if (!employerFormValue) {
    return null;
  }

  return {
    name: employerFormValue.name,
    ...mapToPostalCodeAndCity(employerFormValue.zipAndCity),
    countryIsoCode: employerFormValue.countryIsoCode
  };
}

function mapToContact(contactFormValue: ContactFormValue): Contact {
  return {
    salutation: contactFormValue.salutation,
    firstName: contactFormValue.firstName,
    lastName: contactFormValue.lastName,
    phone: contactFormValue.phone,
    email: contactFormValue.email,
    languageIsoCode: contactFormValue.languageIsoCode
  };
}

function mapToPublicContact(publicContactFormValue: PublicContactFormValue): PublicContact {
  return {
    salutation: publicContactFormValue.salutation,
    firstName: publicContactFormValue.firstName,
    lastName: publicContactFormValue.lastName,
    phone: publicContactFormValue.phone,
    email: publicContactFormValue.email
  };
}

function mapToPublication(publicationFormValue: PublicationFormValue): Publication {
  return {
    euresDisplay: publicationFormValue.euresDisplay,
    publicDisplay: publicationFormValue.publicDisplay,
    startDate: toISOLocalDate(now())
  };
}

function mapToApplyChannel(applicationFormValue: ApplicationFormValue): WebformApplyChannel {
  return {
    formUrl: applicationFormValue.formUrl ? applicationFormValue.formUrl : null,
    emailAddress: applicationFormValue.emailAddress ? applicationFormValue.emailAddress : null,
    phoneNumber: applicationFormValue.phoneNumber ? applicationFormValue.phoneNumber : null,
    postAddress: mapToApplyChannelPostAddress(applicationFormValue.postAddress),
    additionalInfo: applicationFormValue.additionalInfo
  };
}

function mapToApplyChannelPostAddress(postAddressFormValue: PostAddressFormValue): WebformPostAddress {
  if (!postAddressFormValue) {
    return null;
  }

  const postOfficeBoxNumber = postAddressFormValue.postOfficeBoxNumberOrStreet.postOfficeBoxNumber;

  return {
    name: postAddressFormValue.name,
    countryIsoCode: postAddressFormValue.countryIsoCode,
    street: postAddressFormValue.postOfficeBoxNumberOrStreet.street,
    houseNumber: postAddressFormValue.houseNumber,
    postOfficeBoxNumber,
    ...mapToPostalCodeAndCity(postAddressFormValue.zipAndCity)
  };
}
