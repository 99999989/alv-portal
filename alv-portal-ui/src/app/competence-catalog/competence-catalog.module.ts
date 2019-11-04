import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CompetenceCatalogRoutingModule } from './competence-catalog-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CompetenceCatalogRoutingModule
  ],
  declarations: [],
  entryComponents: [],
  providers: []
})
export class CompetenceCatalogModule {
}
