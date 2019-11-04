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
