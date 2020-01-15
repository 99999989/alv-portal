import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PrerequisitesOverviewComponent } from './prerequisites-overview/prerequisites-overview.component';

const routes: Routes = [
  {
    path: '',
    component: PrerequisitesOverviewComponent
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

export class PrerequisitesRoutingModule {
}
