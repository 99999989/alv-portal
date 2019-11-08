import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChFichesOverviewComponent } from './ch-fiches-overview/ch-fiches-overview.component';
import { ChFicheDetailComponent } from './ch-fiche-detail/ch-fiche-detail.component';
import { ChFicheResolverService } from './ch-fiche-detail/ch-fiche-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: ChFichesOverviewComponent
  },
  {
    path: 'edit/:id',
    component: ChFicheDetailComponent,
    resolve: {
      chFiche: ChFicheResolverService
    }
  },
  {
    path: 'create',
    component: ChFicheDetailComponent
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

export class ChFichesRoutingModule {
}
