import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'ch-fiches',
    loadChildren: './ch-fiches/ch-fiches.module#ChFichesModule',
    data: {
      titleKey: 'portal.competence-catalog.ch-fiches.browser-title',
    }
  },
  {
    path: 'competence-sets',
    loadChildren: './competence-sets/competence-sets.module#CompetenceSetsModule',
    data: {
      titleKey: 'portal.competence-catalog.competence-sets.browser-title',
    }
  },
  {
    path: 'competence-elements',
    loadChildren: './competence-elements/competence-elements.module#CompetenceElementsModule',
    data: {
      titleKey: 'portal.competence-catalog.competence-elements.browser-title',
    }
  },
  {
    path: 'prerequisites',
    loadChildren: './prerequisites/prerequisites.module#PrerequisitesModule',
    data: {
      titleKey: 'portal.competence-catalog.prerequisites.browser-title',
    }
  },
  {
    path: 'softskills',
    loadChildren: './softskills/softskills.module#SoftskillsModule',
    data: {
      titleKey: 'portal.competence-catalog.softskills.browser-title',
    }
  },
  {
    path: 'work-environments',
    loadChildren: './work-environments/work-environments.module#WorkEnvironmentsModule',
    data: {
      titleKey: 'portal.competence-catalog.work-environments.browser-title',
    }
  },
  {
    path: '**',
    redirectTo: 'ch-fiches'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      routes
    )
  ],
  exports: [
    RouterModule
  ]
})

export class CompetenceCatalogRoutingModule {
}
