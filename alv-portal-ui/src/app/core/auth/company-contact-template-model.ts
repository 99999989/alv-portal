import {
  Accountability,
  CompanyContactTemplate
} from '../../shared/backend-services/user-info/user-info.types';
import { User } from './user.model';

export class CompanyContactTemplateModel {

  private readonly _companyContactTemplate: CompanyContactTemplate;

  private readonly _firstName: string;

  private readonly _lastName: string;

  public readonly companyExternalId: string;

  private readonly _displayName: string;

  constructor(companyContactTemplate: CompanyContactTemplate, user: User, accountability: Accountability) {
    this._companyContactTemplate = companyContactTemplate;
    this._firstName = user.firstName;
    this._lastName = user.lastName;
    this.companyExternalId = accountability.companyExternalId;
    this._displayName = user.displayName;
  }

  get companyContactTemplate(): CompanyContactTemplate {
    return this._companyContactTemplate;
  }

  get companyId(): string {
    return this._companyContactTemplate.companyId;
  }

  get companyName(): string {
    return this._companyContactTemplate.companyName;
  }

  get companyStreet(): string {
    return this._companyContactTemplate.companyStreet;
  }

  get companyHouseNr(): string {
    return this._companyContactTemplate.companyHouseNr;
  }

  get companyCity(): string {
    return this._companyContactTemplate.companyCity;
  }

  get companyZipCode(): string {
    return this._companyContactTemplate.companyZipCode;
  }

  get salutation(): string {
    return this._companyContactTemplate.salutation;
  }

  get phone(): string {
    return this._companyContactTemplate.phone;
  }

  get email(): string {
    return this._companyContactTemplate.email;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get displayName(): string {
    return this._displayName;
  }
}

