import {
  hasAnyAuthorities,
  isAnyUser,
  isNotAuthenticatedUser,
  User,
  UserRole
} from '../../../core/auth/user.model';
import {
  isCompetenceCatalog,
  isEalv
} from '../../../core/app-context/app-context.service';
import { AppContext } from '../../../core/app-context/app-context.enum';
import {
  EALV_MAIN_MENU_ENTRIES,
  ONLINE_FORMS_MENU_ENTRIES,
  SETTINGS_MENU_ENTRIES
} from './menu-entries';
import { MenuEntry } from './menu-entry.type';

export interface UserMenuDefinition {
  id: string;
  mainMenuEntryKeys: string[];
  onlineFormsMenuEntryKeys?: string[];
  settingsMenuEntryKeys?: string[];
  userPredicate: (user: User) => boolean;
  appContextPredicate: (appContext: AppContext) => boolean;
}

const allEntriesOf = function (menuEntries: MenuEntry[]) {
  return menuEntries.map(entry => entry.id);
};

export const USER_MENU_DEFINITIONS: UserMenuDefinition[] = [
  {
    id: 'ANONYM',
    mainMenuEntryKeys: ['home', 'job-search', 'candidate-search', 'job-publication'],
    onlineFormsMenuEntryKeys: [],
    settingsMenuEntryKeys: [],
    userPredicate: isNotAuthenticatedUser,
    appContextPredicate: isEalv
  },
  {
    id: 'STES',
    mainMenuEntryKeys: ['dashboard', 'job-search', 'job-search-profiles', 'job-favourites'],
    onlineFormsMenuEntryKeys: ['work-efforts', 'application-documents'],
    settingsMenuEntryKeys: ['user-settings'],
    userPredicate: (u) => hasAnyAuthorities(u, [UserRole.ROLE_JOB_SEEKER]),
    appContextPredicate: isEalv
  },
  {
    id: 'PAV',
    mainMenuEntryKeys: ['dashboard', 'candidate-search', 'candidate-search-profiles', 'job-publication', 'manage-job-ads', 'job-search', 'job-search-profiles', 'job-favourites'],
    onlineFormsMenuEntryKeys: [],
    settingsMenuEntryKeys: ['user-settings'],
    userPredicate: (u) => hasAnyAuthorities(u, [UserRole.ROLE_PAV]),
    appContextPredicate: isEalv
  },
  {
    id: 'COMPANY',
    mainMenuEntryKeys: ['dashboard', 'candidate-search', 'candidate-search-profiles', 'job-publication', 'manage-job-ads', 'job-search', 'job-search-profiles', 'job-favourites'],
    onlineFormsMenuEntryKeys: [],
    settingsMenuEntryKeys: ['user-settings'],
    userPredicate: (u) => hasAnyAuthorities(u, [UserRole.ROLE_COMPANY]),
    appContextPredicate: isEalv
  },
  {
    id: 'EALV-ADMIN',
    mainMenuEntryKeys: allEntriesOf(EALV_MAIN_MENU_ENTRIES),
    onlineFormsMenuEntryKeys: allEntriesOf(ONLINE_FORMS_MENU_ENTRIES),
    settingsMenuEntryKeys: allEntriesOf(SETTINGS_MENU_ENTRIES),
    userPredicate: (u) => hasAnyAuthorities(u, [UserRole.ROLE_ADMIN, UserRole.ROLE_SYSADMIN]),
    appContextPredicate: isEalv
  },
  {
    id: 'COMPETENCE-CATALOG',
    mainMenuEntryKeys: ['ch-fiches', 'competence-sets', 'competence-elements'],
    onlineFormsMenuEntryKeys: [],
    settingsMenuEntryKeys: [],
    userPredicate: isAnyUser,
    appContextPredicate: isCompetenceCatalog
  }
];


