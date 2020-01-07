import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RequirementsOverviewComponent } from './requirements-overview/requirements-overview.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementsOverviewComponent
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

export class RequirementsRoutingModule {
}
