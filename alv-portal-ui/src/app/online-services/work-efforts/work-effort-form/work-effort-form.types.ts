import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ZipCityFormValue } from '../../../shared/forms/input/zip-city-input/zip-city-form-value.types';
import { now } from '../../../shared/forms/input/ngb-date-utils';
import { IsoCountryService } from '../../../shared/localities/iso-country.service';

type ArrayFromInterface<T> = (keyof (T))[];

export interface ApplyChannelsFormValue {
  ELECTRONIC: boolean;
  MAIL: boolean;
  PERSONAL: boolean;
  PHONE: boolean;
}

export const formPossibleApplyChannels: ArrayFromInterface<ApplyChannelsFormValue> = ['ELECTRONIC', 'MAIL', 'PERSONAL', 'PHONE'];


export interface ResultsFormValue {
  PENDING: boolean;
  REJECTED: boolean;
  EMPLOYED: boolean;
  INTERVIEW: boolean;
}

export const formPossibleResults: ArrayFromInterface<ResultsFormValue> = ['PENDING', 'INTERVIEW', 'EMPLOYED', 'REJECTED'];

export enum WorkLoadFormOption {
  FULLTIME = 'FULLTIME',
  PARTTIME = 'PARTTIME'
}

export interface WorkEffortFormValue {
  id?: string;
  companyName: string;
  date: NgbDateStruct;
  applyChannels: ApplyChannelsFormValue;
  companyAddress?: {
    countryIsoCode: string;
    postOfficeBoxNumberOrStreet: {
      street?: string;
      houseNumber?: string;
      postOfficeBoxNumber?: string;
    };
    zipAndCity?: ZipCityFormValue; //it's important to keep the naming this way because it's generated by a zip input
  };
  contactPerson?: string;
  companyEmailAndUrl?: {
    email?: string;
    url?: string;
  };
  phone?: string;
  occupation: string;
  appliedThroughRav: boolean;
  results: ResultsFormValue;
  rejectionReason?: string;
  workload: WorkLoadFormOption;
}

export const emptyWorkEffortFormValue = {
  companyName: '',
  date: now(),
  applyChannels: {
    PERSONAL: null,
    PHONE: null,
    MAIL: null,
    ELECTRONIC: null
  },
  companyAddress: {
    countryIsoCode: IsoCountryService.ISO_CODE_SWITZERLAND,
  },
  results: {
    PENDING: false,
    REJECTED: false,
    EMPLOYED: false,
    INTERVIEW: false
  }
};

