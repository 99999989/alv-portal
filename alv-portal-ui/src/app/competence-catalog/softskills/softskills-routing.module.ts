import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SoftskillsOverviewComponent } from './softskills-overview/softskills-overview.component';

const routes: Routes = [
  {
    path: '',
    component: SoftskillsOverviewComponent
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

export class SoftskillsRoutingModule {
}
