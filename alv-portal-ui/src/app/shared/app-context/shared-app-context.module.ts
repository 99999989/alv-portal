import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContextEalvDirective } from './app-context-ealv.directive';
import { AppContextCompetenceCatalogDirective } from './app-context-competence-catalog.directive';


@NgModule({
  declarations: [
    AppContextEalvDirective,
    AppContextCompetenceCatalogDirective
  ],
  imports: [
    CommonModule
  ],
  entryComponents: [],
  exports: [
    AppContextEalvDirective,
    AppContextCompetenceCatalogDirective
  ],
  providers: []
})
export class SharedAppContextModule {
}

