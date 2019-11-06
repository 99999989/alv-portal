import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompetenceSetsOverviewComponent } from './competence-sets-overview/competence-sets-overview.component';
import { CompetenceSetDetailComponent } from './competence-set-detail/competence-set-detail.component';
import { CompetenceSetResolverService } from './competence-set-detail/competence-set-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: CompetenceSetsOverviewComponent
  },
  {
    path: 'edit/:id',
    component: CompetenceSetDetailComponent,
    resolve: {
      competenceSet: CompetenceSetResolverService
    }
  },
  {
    path: 'create',
    component: CompetenceSetDetailComponent
  },
  {
    path: '**',
    redirectTo: ''
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

export class CompetenceSetsRoutingModule {
}
