import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CandidateSearchComponent } from './candidate-search/candidate-search.component';
import { CandidateDetailComponent } from './candidate-detail/candidate-detail.component';
import { CandidateDetailGuard } from './candidate-detail/candidate-detail.guard';
import { CandidateSearchGuard } from './candidate-search/candidate-search.guard';

const routes: Routes = [
  {
    path: '',
    component: CandidateSearchComponent,
    canActivate: [CandidateSearchGuard],
    data: { titleKey: 'portal.candidate-search.browser-title' }
  },
  {
    path: ':id',
    component: CandidateDetailComponent,
    canActivate: [CandidateDetailGuard],
    data: { titleKey: 'portal.candidate-search.browser-title' }
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

export class CandidateSearchRoutingModule {
}