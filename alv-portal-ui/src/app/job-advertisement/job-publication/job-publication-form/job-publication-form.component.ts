import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { JobPublicationFormPanelId } from './job-publication-form-panel-id.enum';
import { CompanyFormValue } from './company/company-form-value.types';
import { JobDescriptionFormValue } from './job-description/job-description-form-value.types';
import { LocationFormValue } from './location/location-form-value.types';
import { OccupationFormValue } from './occupation/occupation-form-value.types';
import { LanguageSkill } from '../../../shared/backend-services/shared.types';
import { EmploymentFormValue } from './employment/employment-form-value.types';
import { ContactFormValue } from './contact/contact-form-value.types';
import { PublicContactFormValue } from './public-contact/public-contact-form-value.types';
import { PublicationFormValue } from './publication/publication-form-value.types';
import { EmployerFormValue, emptyEmployerFormValue } from './employer/employer-form-value.types';
import { ApplicationFormValue } from './application/application-form-value.types';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import * as  jobPublicationFormMapper from './job-publication-form.mapper';
import { JobPublicationFormValueKeys } from './job-publication-form-value.types';
import { InitialFormValueConfig, JobPublicationFormValueFactory } from './job-publication-form-value-factory';
import { JobAdvertisementRepository } from '../../../shared/backend-services/job-advertisement/job-advertisement.repository';
import { JobAdvertisement } from '../../../shared/backend-services/job-advertisement/job-advertisement.types';
import { CollapsePanelComponent } from '../../../shared/layout/collapse-panel/collapse-panel.component';
import { NotificationType } from '../../../shared/layout/notifications/notification.model';

const PANEL_ID_TO_FORM_GROUP_KEY_MAP = new Map<JobPublicationFormPanelId, JobPublicationFormValueKeys>([
  [JobPublicationFormPanelId.JOB_PUBLICATION_OCCUPATION, JobPublicationFormValueKeys.OCCUPATION],
  [JobPublicationFormPanelId.JOB_PUBLICATION_LANGUAGES, JobPublicationFormValueKeys.LANGUAGE_SKILLS],
  [JobPublicationFormPanelId.JOB_PUBLICATION_EMPLOYMENT, JobPublicationFormValueKeys.EMPLOYMENT],
  [JobPublicationFormPanelId.JOB_PUBLICATION_EMPLOYER, JobPublicationFormValueKeys.EMPLOYER],
  [JobPublicationFormPanelId.JOB_PUBLICATION_LOCATION, JobPublicationFormValueKeys.LOCATION],
  [JobPublicationFormPanelId.JOB_PUBLICATION_COMPANY, JobPublicationFormValueKeys.COMPANY],
  [JobPublicationFormPanelId.JOB_PUBLICATION_CONTACT, JobPublicationFormValueKeys.CONTACT],
  [JobPublicationFormPanelId.JOB_PUBLICATION_PUBLIC_CONTACT, JobPublicationFormValueKeys.PUBLIC_CONTACT],
  [JobPublicationFormPanelId.JOB_PUBLICATION_APPLICATION, JobPublicationFormValueKeys.APPLICATION],
  [JobPublicationFormPanelId.JOB_PUBLICATION_PUBLICATION, JobPublicationFormValueKeys.PUBLICATION]
]);

@Component({
  selector: 'alv-job-publication-form',
  templateUrl: './job-publication-form.component.html',
  styleUrls: ['./job-publication-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPublicationFormComponent extends AbstractSubscriber implements OnInit {

  @ViewChildren(CollapsePanelComponent)
  collapsePanels: QueryList<CollapsePanelComponent>;

  @Output()
  jobPublicationCreated = new EventEmitter<JobAdvertisement>();

  @Input()
  initialFormValueConfig: InitialFormValueConfig;

  @Input()
  currentLanguage: string;

  jobPublicationForm: FormGroup;

  jobPublicationFormPanelId = JobPublicationFormPanelId;

  jobDescriptionFormValue: JobDescriptionFormValue;

  occupationFormValue: OccupationFormValue;

  languagesFormValue: LanguageSkill[];

  employmentFormValue: EmploymentFormValue;

  locationFormValue: LocationFormValue;

  companyFormValue: CompanyFormValue;

  employerFormValue: EmployerFormValue;

  contactFormValue: ContactFormValue;

  publicContactFormValue: PublicContactFormValue;

  applicationFormValue: ApplicationFormValue;

  publicationFormValue: PublicationFormValue;

  chiscoWarningTransitionNotification = {
    type: NotificationType.WARNING,
    isSticky: true,
  };

  constructor(private fb: FormBuilder,
              private jobPublicationFormValueFactory: JobPublicationFormValueFactory,
              private jobAdvertisementRepository: JobAdvertisementRepository) {
    super();

    this.jobPublicationForm = this.fb.group({
      surrogate: [false, []],
      disclaimer: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    const initialJobPublicationFormValue = this.jobPublicationFormValueFactory.createJobPublicationFormValue(this.initialFormValueConfig, this.currentLanguage);

    this.jobDescriptionFormValue = initialJobPublicationFormValue.jobDescription;
    this.occupationFormValue = initialJobPublicationFormValue.occupation;
    this.languagesFormValue = initialJobPublicationFormValue.languageSkills;
    this.employmentFormValue = initialJobPublicationFormValue.employment;
    this.locationFormValue = initialJobPublicationFormValue.location;
    this.companyFormValue = initialJobPublicationFormValue.company;
    this.employerFormValue = initialJobPublicationFormValue.employer;
    this.contactFormValue = initialJobPublicationFormValue.contact;
    this.publicContactFormValue = initialJobPublicationFormValue.publicContact;
    this.applicationFormValue = initialJobPublicationFormValue.application;
    this.publicationFormValue = initialJobPublicationFormValue.publication;

    const surrogateFormControl = this.jobPublicationForm.get(JobPublicationFormValueKeys.SURROGATE);
    surrogateFormControl.patchValue(initialJobPublicationFormValue.surrogate, { emitEvent: false });
    surrogateFormControl.valueChanges.pipe(
      distinctUntilChanged(),
      filter((value: boolean) => value),
      takeUntil(this.ngUnsubscribe)
    ).subscribe((_) => this.employerFormValue = emptyEmployerFormValue());

  }


  copyFromContact() {
    const contactValue = this.jobPublicationForm.get(JobPublicationFormValueKeys.CONTACT).value;
    this.jobPublicationForm.get(JobPublicationFormValueKeys.PUBLIC_CONTACT).patchValue(contactValue, { emitEvent: false });
  }

  submit() {
    const createJobAdvertisement = jobPublicationFormMapper.mapToCreateJobAdvertisement(this.jobPublicationForm.value, this.currentLanguage);
    this.jobAdvertisementRepository.save(createJobAdvertisement)
      .subscribe((jobAdvertisement) => {
        this.jobPublicationCreated.emit(jobAdvertisement);
      });
  }

  reset() {
    const emptyFormValue = this.jobPublicationFormValueFactory.createEmpty(this.currentLanguage);
    this.jobPublicationForm.reset(emptyFormValue);
  }


  expandCollapsePanels() {
    return () => {
      const isInValid = (panel: CollapsePanelComponent) => {
        const groupName = PANEL_ID_TO_FORM_GROUP_KEY_MAP.get(<JobPublicationFormPanelId>panel.panelId);
        const group = this.jobPublicationForm.get(groupName);

        return (!!group) ? (!group.valid) : false;
      };

      this.collapsePanels
        .filter(isInValid)
        .forEach(panel => panel.expand());
    };
  }
}

