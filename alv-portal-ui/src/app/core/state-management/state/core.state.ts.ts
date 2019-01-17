import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from '../../auth/user.model';
import {
  Accountability,
  CompanyContactTemplate
} from '../../../shared/backend-services/user-info/user-info.types';
import { CompanyContactTemplateModel } from '../../auth/company-contact-template-model';

export const initialState: CoreState = {
  currentLanguage: null,
  currentUser: undefined,
  currentCompany: undefined,
  currentAccountability: undefined,
  accountabilities: undefined,
  mainNavigationExpanded: false,
  mobileNavigationExpanded: false
};

export interface CoreState {
  currentLanguage: string;
  currentUser: User;
  currentCompany: CompanyContactTemplate;
  currentAccountability: Accountability;
  accountabilities: Accountability[];
  mainNavigationExpanded: boolean;
  mobileNavigationExpanded: boolean;
}

const getCoreState = createFeatureSelector<CoreState>('coreState');

export const getCurrentLanguage = createSelector(getCoreState, (state: CoreState) => state.currentLanguage);
export const getCurrentUser = createSelector(getCoreState, (state: CoreState) => state.currentUser);
export const getCurrentCompany = createSelector(getCoreState, (state: CoreState) => state.currentCompany);
export const getMainNavigationExpanded = createSelector(getCoreState, (state: CoreState) => state.mainNavigationExpanded);
export const getMobileNavigationExpanded = createSelector(getCoreState, (state: CoreState) => state.mobileNavigationExpanded);
export const getCurrentAccountability = createSelector(getCoreState, (state: CoreState) => state.currentAccountability);
export const getCurrentCompanyContactTemplateModel = createSelector(getCurrentUser, getCurrentCompany, getCurrentAccountability, (user, companyContactTemplate, accountability) => {
  if (user === undefined || accountability === undefined || companyContactTemplate === undefined) {
    return undefined;
  }
  if (companyContactTemplate && accountability && user) {
    return new CompanyContactTemplateModel(companyContactTemplate, user, accountability);
  }
  return null;
});

export const notFetched = (u: any) => {
  return u === undefined;
};
