import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  Notification,
  NotificationType
} from '../../../shared/layout/notifications/notification.model';
import { EMPTY, Observable, of } from 'rxjs';
import { SelectableOption } from '../../../shared/forms/input/selectable-option.model';
import { IsoCountryService } from '../../../shared/localities/iso-country.service';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import { catchError, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AbstractSubscriber } from '../../../core/abstract-subscriber';

import { ProofOfWorkEffortsRepository } from '../../../shared/backend-services/work-efforts/proof-of-work-efforts.repository';
import { ActivatedRoute, Router } from '@angular/router';
import { patternInputValidator } from '../../../shared/forms/input/input-field/pattern-input.validator';
import { URL_REGEX } from '../../../shared/forms/regex-patterns';
import { LinkPanelId } from '../../../shared/layout/link-panel/link-panel.component';
import {
  ZipCityFormValue,
  ZipCityValidators
} from '../../../shared/forms/input/zip-city-input/zip-city-form-value.types';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { phoneInputValidator } from '../../../shared/forms/input/input-field/phone-input.validator';
import { ModalService } from '../../../shared/layout/modal/modal.service';
import {
  ActionsOnClose,
  SuccessModalComponent
} from './success-modal/success-modal.component';
import { IconKey } from '../../../shared/icons/custom-icon/custom-icon.component';
import {
  ApplyChannelsFormValue,
  emptyWorkEffortFormValue,
  formPossibleApplyChannels,
  formPossibleApplyStatus,
  WORK_EFFORT_MONTHS_DIFF,
  WorkEffortFormValue,
  WorkLoadFormOption
} from './work-effort-form.types';
import { deltaDate, mapDateToNgbDate } from '../../../shared/forms/input/ngb-date-utils';
import { createInitialZipAndCityFormValue } from '../../../shared/forms/input/zip-city-input/zip-city-form-mappers';
import { LayoutConstants } from '../../../shared/layout/layout-constants.enum';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { mapToWorkEffortBackendValue } from './work-effort-form.mapper';
import { requiredIfValidator } from '../../../shared/forms/input/validators/required-if.validator';
import { conditionalValidator } from '../../../shared/forms/input/validators/conditional.validator';
import { zipCityInputSettings } from '../../../shared/forms/input/zip-city-input/zip-city-input.component';
import {
  ProofOfWorkEfforts,
  ProofOfWorkEffortsErrors
} from '../../../shared/backend-services/work-efforts/proof-of-work-efforts.types';
import { ScrollService } from '../../../core/scroll.service';
import { NotificationsService } from '../../../core/notifications.service';
import { I18nService } from '../../../core/i18n.service';
import { Languages } from '../../../core/languages.constants';
import { ValidationMessage } from '../../../shared/forms/input/validation-messages/validation-message.model';
import { emailInputValidator } from '../../../shared/forms/input/input-field/email-input.validator';

const workLoadPrefix = 'portal.work-efforts.edit-form.work-loads.';
const appliedThroughRavPrefix = 'portal.work-efforts.edit-form.applied-through-rav.';

@Component({
  selector: 'alv-work-effort-form',
  templateUrl: './work-effort-form.component.html',
  styleUrls: ['./work-effort-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkEffortFormComponent extends AbstractSubscriber implements OnInit {

  readonly PO_BOX_MAX_LENGTH = 6;
  readonly HOUSE_NUMBER_MAX_LENGTH = 10;
  readonly STREET_MAX_LENGTH = 60;
  readonly NAME_MAX_LENGTH = 100;
  readonly REJECTION_REASON_MAX_LENGTH = 250;
  readonly OCCUPATION_MAX_LENGTH = 100;
  readonly CONTACT_PERSON_MAX_LENGTH = 100;
  readonly EMAIL_MAX_LENGTH = 100;
  readonly FORM_URL_MAX_LENGTH = 255;
  readonly MAX_DAYS_DIFF = 5;
  readonly LinkPanelId = LinkPanelId;
  readonly IconKey = IconKey;
  readonly layoutConstants = LayoutConstants;
  countryIsoCode$: Observable<String>;
  workEffortFormGroup: FormGroup;
  initialWorkEffort: WorkEffortFormValue;
  applyStatusCheckboxNames = formPossibleApplyStatus;
  applyChannelsCheckboxNames = formPossibleApplyChannels;
  countryOptions$: Observable<SelectableOption[]>;
  dateValidationMessages: ValidationMessage[] = [
    {
      error: 'ngbDate',
      message: 'portal.work-efforts.edit-form.error.date-format',
      requiredAfter: 'portal.work-efforts.edit-form.error.date-required-after',
      requiredBefore: 'portal.work-efforts.edit-form.error.date-required-before'
    },
    {
      error: 'required',
      message: 'portal.online-forms.validation.required'
    }
  ];
  toolbarButtons = [
    {
      label: 'entity.action.back',
      route: 'work-efforts'
    },
    {
      label: 'portal.navigation.menu-entry.work-efforts',
      route: '.'
    }
  ];
  bottomAlert: Notification = {
    isSticky: true,
    type: NotificationType.WARNING
  };
  workLoadOptions$ = of(Object.values(WorkLoadFormOption).map(value => ({
    value: value,
    label: workLoadPrefix + value
  })));
  appliedThroughRavOptions$ = of([{
    value: false,
    label: appliedThroughRavPrefix + 'no'
  }, {
    value: true,
    label: appliedThroughRavPrefix + 'yes'
  }]);
  initialZipAndCity: ZipCityFormValue;
  minDate: NgbDate;
  maxDate: NgbDate;
  zipCityValidators: ZipCityValidators = {
    zipCityAutoComplete: [requiredIfValidator(() => this.isCompanyAddressRequired())],
    zipCode: [
      requiredIfValidator(() => this.isCompanyAddressRequired()),
      Validators.maxLength(zipCityInputSettings.ZIP_CODE_MAX_LENGTH)
    ],
    city: [
      requiredIfValidator(() => this.isCompanyAddressRequired()),
      Validators.maxLength(zipCityInputSettings.CITY_MAX_LENGTH)
    ]
  };
  isSubmitting: boolean;
  selectedApplyChannels: ApplyChannelsFormValue;

  readonly: boolean;

  constructor(private fb: FormBuilder,
              private isoCountryService: IsoCountryService,
              private proofOfWorkEffortsRepository: ProofOfWorkEffortsRepository,
              private authenticationService: AuthenticationService,
              private notificationsService: NotificationsService,
              private route: ActivatedRoute,
              private i18nService: I18nService,
              public router: Router,
              private cdRef: ChangeDetectorRef,
              private scrollService: ScrollService,
              private modalService: ModalService) {

    super();
  }

  get applyChannelsValue(): ApplyChannelsFormValue {
    return this.workEffortFormGroup.get('applyChannels').value;
  }

  ngOnInit() {
    this.countryOptions$ = this.isoCountryService.getSortedCountryOptions(this.i18nService.currentLanguage$.pipe(
      map(lang => this.isoCountryService.getCountryOptions(lang === Languages.EN ? Languages.DE : lang))
    ));

    this.setInitialFormState();

    const controlsConfig = {
      id: [undefined],
      date: ['', Validators.required],
      applyChannels: this.generateApplyChannelsGroup(),
      companyName: ['', Validators.required],

      companyAddress: this.fb.group({
          countryIsoCode: ['CH'],
          postOfficeBoxNumberOrStreet: this.fb.group({
            street: [''],
            houseNumber: [''],
            postOfficeBoxNumber: [''],
          }, {
            validator: [conditionalValidator(() => this.isCompanyAddressRequired(),
              atLeastOneRequiredValidator(['street', 'postOfficeBoxNumber']))]
          }),
        }
      ),
      contactPerson: ['', [requiredIfValidator(() => this.isContactPersonRequired())]],
      companyEmailAndUrl: this.fb.group(
        {
          email: ['', [
            emailInputValidator(),
            Validators.maxLength(this.EMAIL_MAX_LENGTH)
          ]],
          url: ['', [
            patternInputValidator(URL_REGEX),
            Validators.maxLength(this.FORM_URL_MAX_LENGTH)
          ]]
        }, {
          validators: [
            conditionalValidator(() => this.isCompanyEmailOrUrlRequired(),
              atLeastOneRequiredValidator(['email', 'url']))
          ]
        }
      ),
      phone: ['', [phoneInputValidator(),
        requiredIfValidator(() => this.isPhoneRequired())]],
      occupation: ['', [Validators.required, Validators.maxLength(this.OCCUPATION_MAX_LENGTH)]],
      appliedThroughRav: ['', Validators.required],
      workload: ['', Validators.required],
      applyStatus: this.generateApplyStatusGroup(),
      rejectionReason: ['', [
        Validators.maxLength(this.REJECTION_REASON_MAX_LENGTH),
        requiredIfValidator(() => this.workEffortFormGroup.get('applyStatus').value.REJECTED)
      ]]
    };

    this.workEffortFormGroup = this.fb.group(controlsConfig);

    this.workEffortFormGroup.patchValue(this.initialWorkEffort);

    if (this.readonly) {
      this.workEffortFormGroup.disable();
    }

    this.setUpUnclicking({
      PENDING: ['EMPLOYED', 'REJECTED'],
      REJECTED: ['EMPLOYED', 'PENDING'],
      EMPLOYED: ['REJECTED', 'PENDING'],
      INTERVIEW: []
    });

    this.setupMinMaxDate();

    this.countryIsoCode$ = this.workEffortFormGroup.get('companyAddress').get('countryIsoCode').valueChanges
      .pipe(
        filter((value) => !!value),
        startWith(this.initialWorkEffort.companyAddress.countryIsoCode)
      );

    this.initialZipAndCity = createInitialZipAndCityFormValue(
      this.initialWorkEffort.companyAddress.zipAndCity,
      this.initialWorkEffort.companyAddress.countryIsoCode
    );

    this.selectedApplyChannels = this.workEffortFormGroup.get('applyChannels').value;
    this.workEffortFormGroup.get('applyChannels').valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(applyChannels => {
        this.selectedApplyChannels = applyChannels;
        this.updateValueAndValidity();
      });

  }

  submit() {
    this.isSubmitting = true;
    this.authenticationService.getCurrentUser().pipe(
      filter(user => !!user),
      switchMap(user => this.createOrUpdateWorkEffort(user.id)),
      catchError(error => {
        this.isSubmitting = false;
        this.cdRef.detectChanges(); // needed because of changeDetectionStrategy.OnPush
        if (this.hasNoProofOfWorkEffortsFoundError(error)) {
          this.notificationsService.error('portal.work-efforts.edit-form.error.control-period', true);
          return EMPTY;
        }
        throw error;
      })
    ).subscribe(result => {
      this.isSubmitting = false;
      if (result) {
        this.openSuccessModal();
      }
    });
  }

  goToWorkEffortsList() {
    this.router.navigate(['work-efforts']);
  }

  isCompanyAddressRequired() {
    const applyChannel = this.applyChannelsValue;
    return applyChannel.MAIL || applyChannel.PERSONAL || applyChannel.PHONE;
  }

  isStreetRequired(): boolean {
    return this.isCompanyAddressRequired() &&
      !this.workEffortFormGroup.get('companyAddress').get('postOfficeBoxNumberOrStreet').get('postOfficeBoxNumber').value;
  }

  isPoBoxRequired(): boolean {
    return this.isCompanyAddressRequired() &&
      !this.workEffortFormGroup.get('companyAddress').get('postOfficeBoxNumberOrStreet').get('street').value;
  }

  isContactPersonRequired() {
    const applyChannel = this.applyChannelsValue;
    return applyChannel.PERSONAL || applyChannel.PHONE;
  }

  isPhoneRequired() {
    return this.applyChannelsValue.PHONE;
  }

  isCompanyEmailOrUrlRequired() {
    return this.applyChannelsValue.ELECTRONIC;
  }

  isCompanyEmailRequired(): boolean {
    return this.isCompanyEmailOrUrlRequired() &&
      !this.workEffortFormGroup.get('companyEmailAndUrl').get('url').value;
  }

  isCompanyUrlRequired(): boolean {
    return this.isCompanyEmailOrUrlRequired() &&
      !this.workEffortFormGroup.get('companyEmailAndUrl').get('email').value;
  }

  private setInitialFormState() {
    if (this.route.snapshot.data.initialFormInfo) {
      // Edit
      this.initialWorkEffort = this.route.snapshot.data.initialFormInfo.workEffortFormValue;
      this.readonly = this.route.snapshot.data.initialFormInfo.readonly;
    } else {
      // Create
      this.initialWorkEffort = emptyWorkEffortFormValue;
      this.readonly = false;
    }
  }

  private updateValueAndValidity() {
    this.workEffortFormGroup
      .get('companyAddress')
      .get('postOfficeBoxNumberOrStreet')
      .updateValueAndValidity();
    const zipAndCity = this.workEffortFormGroup
      .get('companyAddress')
      .get('zipAndCity');
    if (zipAndCity) {
      zipAndCity
        .get('zipCityAutoComplete')
        .updateValueAndValidity();
    }

    this.workEffortFormGroup
      .get('contactPerson')
      .updateValueAndValidity();
    this.workEffortFormGroup
      .get('companyEmailAndUrl')
      .updateValueAndValidity();
    this.workEffortFormGroup
      .get('phone')
      .updateValueAndValidity();
  }

  private createOrUpdateWorkEffort(userId: string): Observable<ProofOfWorkEfforts> {
    if (this.workEffortFormGroup.value.id) {
      return this.proofOfWorkEffortsRepository.updateWorkEffort(userId,
        mapToWorkEffortBackendValue(this.workEffortFormGroup.value));
    }
    return this.proofOfWorkEffortsRepository.addWorkEffort(userId,
      mapToWorkEffortBackendValue(this.workEffortFormGroup.value));
  }

  private openSuccessModal() {
    // if all fields in the the form are okay
    const successModalRef = this.modalService.openLarge(SuccessModalComponent);
    successModalRef.result.then(res => {
      this.workEffortFormGroup.reset(emptyWorkEffortFormValue);
      if (res === ActionsOnClose.RECORD_NEW) {
        this.createNewWorkEffort();
      } else if (res === ActionsOnClose.GO_TO_LIST) {
        this.goToWorkEffortsList();
      }
    });
  }

  private createNewWorkEffort() {
    this.router.navigate(['work-efforts', 'create']).then(() => {
      this.scrollService.scrollToTop();
    });
  }

  private generateApplyStatusGroup(): FormGroup {
    return this.generateCheckboxesFormGroup(this.applyStatusCheckboxNames, {
      validators: atLeastOneRequiredValidator(this.applyStatusCheckboxNames)
    });
  }

  private generateApplyChannelsGroup(): FormGroup {
    return this.generateCheckboxesFormGroup(this.applyChannelsCheckboxNames, {
      validators: atLeastOneRequiredValidator(this.applyChannelsCheckboxNames)
    });
  }

  private generateCheckboxesFormGroup(checkboxNames: string[], options: AbstractControlOptions | null = null): FormGroup {
    const controlsConfig = {};
    for (const checkbox of checkboxNames) {
      controlsConfig[checkbox] = [null];
    }
    return this.fb.group(controlsConfig, options);
  }

  private setupMinMaxDate() {
    const today = new Date();
    const minDate = deltaDate(today, 0, WORK_EFFORT_MONTHS_DIFF, 0);
    minDate.setDate(1);
    this.minDate = mapDateToNgbDate(minDate);
    this.maxDate = mapDateToNgbDate(deltaDate(today, this.MAX_DAYS_DIFF, 0, 0));
  }

  private hasNoProofOfWorkEffortsFoundError(error): boolean {
    return error.error && error.error.businessExceptionType === ProofOfWorkEffortsErrors.NO_MATCHING_PROOF_OF_WORK_EFFORT_FOUND;
  }

  /**
   * Certain applyStatus are mutually exclusive, for example if the applyStatus of the work effort is rejection,
   * you can't also click an employed checkbox. We unset the mutually exclusive checkboxes each time the user
   * clicks on a applyStatus checkbox group.
   * @param clearingRules keys are checkbox keys. Values are checkboxes you wanna unset if the key is set
   */
  private setUpUnclicking(clearingRules: { [key: string]: string[] }) {
    for (const rule in clearingRules) {
      if (clearingRules.hasOwnProperty(rule)) {
        this.workEffortFormGroup.get('applyStatus').get(rule).valueChanges.pipe(
          takeUntil(this.ngUnsubscribe)
        )
          .subscribe((newValue) => {
            if (newValue) {
              clearingRules[rule].forEach(formControlToUncheck => {
                this.workEffortFormGroup.get('applyStatus').get(formControlToUncheck).setValue(false, { emitEvent: false });
              });
            }
          });
      }
    }
  }

}
