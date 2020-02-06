import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import { ShowcaseComponent } from './showcase/showcase.component';
import { AuthenticatedGuard } from './core/auth/authenticated.guard';
import { NotAuthenticatedGuard } from './core/auth/not-authenticated.guard';
import { LandingPageGuard } from './shared/landing-page/landing-page.guard';
import { DummyComponent } from './shared/dummy/dummy.component';
import { LegacyUrlStrategyRedirectionGuard } from '../legacy-url-strategy-redirection-guard.service';
import { UserRole } from './core/auth/user.model';
import { HasAnyAuthoritiesGuard } from './core/auth/has-any-authorities-guard.service';
import { UserSettingsComponent } from './shared/user-settings/user-settings.component';
import { LazyModuleDeactivateGuard } from './core/lazy-module-deactivate.guard';
import { ModuleName } from './core/state-management/actions/core.actions';
import { HasFeatureGuard } from './core/auth/has-feature-guard.service';
import { FeatureName } from './shared/backend-services/feature-code-list/feature-code-list.types';
import { AppContextGuard } from './core/app-context/app-context.guard';
import { AppContext } from './core/app-context/app-context.enum';

const appRoutes: Routes = [
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule',
    canActivate: [AppContextGuard],
    canActivateChild: [NotAuthenticatedGuard],
    data: {
      appContext: AppContext.EALV
    }
  },
  {
    path: 'registration',
    loadChildren: './registration/registration.module#RegistrationModule',
    canActivate: [AppContextGuard],
    canActivateChild: [NotAuthenticatedGuard],
    data: {
      titleKey: 'portal.registration.browser-title',
      appContext: AppContext.EALV
    }
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [AppContextGuard],
    canActivateChild: [AuthenticatedGuard],
    data: {
      appContext: AppContext.EALV
    }
  },
  {
    path: 'job-search',
    loadChildren: './job-advertisement/job-ad-search/job-ad-search.module#JobAdSearchModule',
    canActivate: [AppContextGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      moduleName: ModuleName.JOB_SEARCH,
      collapseNavigation: true,
      titleKey: 'portal.job-ad-search.browser-title',
      appContext: AppContext.EALV
    }
  },
  {
    path: 'candidate-search',
    loadChildren: './candidate/candidate-search/candidate-search.module#CandidateSearchModule',
    canActivate: [AppContextGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      moduleName: ModuleName.CANDIDATE_SEARCH,
      collapseNavigation: true,
      titleKey: 'portal.candidate-search.browser-title',
      appContext: AppContext.EALV
    }
  },
  {
    path: 'job-publication',
    loadChildren: './job-advertisement/job-publication/job-publication.module#JobPublicationModule',
    canActivate: [AppContextGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      moduleName: ModuleName.JOB_PUBLICATION,
      titleKey: 'portal.job-publication.browser-title',
      scrollToTop: true,
      appContext: AppContext.EALV
    }
  },
  {
    path: 'manage-job-ads',
    loadChildren: './job-advertisement/manage-job-ads/manage-job-ads.module#ManageJobAdsModule',
    canActivate: [AppContextGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      moduleName: ModuleName.MANAGE_JOB_AD,
      titleKey: 'portal.manage-job-ads.browser-title',
      scrollToTop: true,
      appContext: AppContext.EALV
    }
  },
  {
    path: 'job-favourites',
    loadChildren: './job-advertisement/job-ad-favourites/job-ad-favourites.module#JobAdFavouritesModule',
    canActivate: [AppContextGuard],
    canActivateChild: [AuthenticatedGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      moduleName: ModuleName.JOB_AD_FAVOURITE,
      titleKey: 'portal.job-ad-favourites.browser-title',
      scrollToTop: true,
      appContext: AppContext.EALV
    }
  },
  {
    path: 'job-search-profiles',
    loadChildren: './job-advertisement/job-ad-search-profiles/job-ad-search-profiles.module#JobAdSearchProfilesModule',
    canActivate: [AppContextGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      moduleName: ModuleName.JOB_SEARCH_PROFILES,
      titleKey: 'portal.job-ad-search-profiles.browser-title',
      scrollToTop: true,
      appContext: AppContext.EALV
    }
  },
  {
    path: 'work-efforts',
    loadChildren: './online-services/work-efforts/work-efforts.module#WorkEffortsModule',
    canActivate: [AppContextGuard],
    canActivateChild: [HasFeatureGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      featureName: FeatureName.NPA,
      moduleName: ModuleName.WORK_EFFORTS,
      titleKey: 'portal.work-efforts.browser-title',
      scrollToTop: true,
      appContext: AppContext.EALV
    }
  },
  {
    path: 'application-documents',
    loadChildren: './online-services/application-documents/application-documents.module#ApplicationDocumentsModule',
    canActivate: [AppContextGuard],
    canActivateChild: [HasFeatureGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      featureName: FeatureName.BU,
      moduleName: ModuleName.APPLICATION_DOCUMENTS,
      titleKey: 'portal.application-documents.browser-title',
      scrollToTop: true,
      appContext: AppContext.EALV
    }
  },
  {
    path: 'candidate-search-profiles',
    loadChildren: './candidate/candidate-search-profiles/candidate-search-profiles.module#CandidateSearchProfilesModule',
    canActivate: [AppContextGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    canActivateChild: [HasAnyAuthoritiesGuard],
    data: {
      moduleName: ModuleName.CANDIDATE_SEARCH_PROFILES,
      titleKey: 'portal.candidate-search-profiles.browser-title',
      scrollToTop: true,
      authorities: [UserRole.ROLE_COMPANY, UserRole.ROLE_PAV, UserRole.ROLE_ADMIN, UserRole.ROLE_SYSADMIN],
      appContext: AppContext.EALV
    }
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AppContextGuard],
    canActivateChild: [HasAnyAuthoritiesGuard],
    data: {
      authorities: [UserRole.ROLE_SYSADMIN],
      appContext: AppContext.EALV
    }
  },
  {
    path: 'landing',
    component: DummyComponent,
    canActivate: [LandingPageGuard, AppContextGuard],
    data: {
      appContext: undefined
    }
  },
  {
    path: 'showcase',
    component: ShowcaseComponent,
    canActivate: [AppContextGuard],
    data: {
      titleKey: 'portal.showcase.browser-title',
      appContext: AppContext.EALV
    }
  },
  {
    path: 'user-settings',
    component: UserSettingsComponent,
    canActivate: [AuthenticatedGuard, AppContextGuard],
    data: {
      titleKey: 'portal.dashboard.user-settings.browser-title',
      scrollToTop: true,
      appContext: AppContext.EALV
    }
  },
  {
    path: 'pilot',
    loadChildren: './online-services/pilot-activation/pilot-activation.module#PilotActivationModule',
    canActivate: [HasAnyAuthoritiesGuard, AppContextGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      titleKey: 'portal.online-forms.pilot-activation.browser-title',
      authorities: [UserRole.ROLE_JOB_SEEKER],
      appContext: AppContext.EALV
    }
  },
  {
    path: 'kk',
    loadChildren: './competence-catalog/competence-catalog.module#CompetenceCatalogModule',
    canActivate: [AppContextGuard],
    canDeactivate: [LazyModuleDeactivateGuard],
    data: {
      moduleName: ModuleName.COMPETENCE_CATALOG,
      appContext: AppContext.COMPETENCE_CATALOG
    }
  },
  {
    path: '**',
    canActivate: [LegacyUrlStrategyRedirectionGuard],
    component: DummyComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false,
      },
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
