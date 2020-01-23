import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { WorkEnvironmentsOverviewComponent } from './work-environment-overview/work-environment-overview.component';

const routes: Routes = [
  {
    path: '',
    component: WorkEnvironmentsOverviewComponent
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

export class WorkEnvironmentsRoutingModule {
}
