import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { RightsAwareComponent } from '../rights-aware/rights-aware.component';
import { SearchService } from '../../../shared/backend-services/competence-catalog/search-service';
import { DEFAULT_PAGE_SIZE, DEFAULT_SORT } from '../constants';
import { FormControl } from '@angular/forms';
import { ChFiche } from '../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';


export class OverviewComponent extends RightsAwareComponent implements OnInit {

  query = new FormControl();

  items: ChFiche[];

  sortAsc = true;

  protected page = 0;

  constructor(protected authenticationService: AuthenticationService,
              protected itemsRepository: SearchService<any>
  ) {
    super(authenticationService);
  }

  onSortClick() {
    this.sortAsc = !this.sortAsc;
    this.reload();
  }

  onScroll() {
    this.itemsRepository.search({
      body: {
        query: this.query.value || ''
      },
      page: this.page++,
      size: DEFAULT_PAGE_SIZE,
      sort: this.sortAsc ? DEFAULT_SORT.asc : DEFAULT_SORT.desc,
    }).pipe(
    ).subscribe(response => {
      this.items = [...(this.items || []), ...response.content];
    });
  }

  reload() {
    this.throwNotImplementedError();
  }

  private throwNotImplementedError() {
    throw new Error('You are not supposed to call this directly from OverviewComponent,' +
      ' you need to implement your version of reload');
  }

}
