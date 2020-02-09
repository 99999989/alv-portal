import { OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceCatalogEditorAwareComponent } from '../competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { SearchService } from '../../../shared/backend-services/competence-catalog/search-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import {
  DEFAULT_PAGE_SIZE,
  RequestBody
} from '../../../shared/backend-services/request-util';
import {
  CompetenceCatalogSortValue,
  SortIcon,
  SortType
} from '../shared-competence-catalog.types';
import { DEFAULT_SORT_OPTIONS } from '../constants';
import { CompetenceItem } from '../../../shared/backend-services/competence-catalog/competence-item.types';


export class OverviewComponent<T extends CompetenceItem> extends CompetenceCatalogEditorAwareComponent implements OnInit {

  sort: CompetenceCatalogSortValue = {
    type: SortType.DATE_DESC,
    icon: SortIcon.NUMERIC_UP
  };

  searchForm: FormGroup;

  items: T[];

  protected page = 0;

  constructor(protected authenticationService: AuthenticationService,
              protected itemsRepository: SearchService<any>,
              protected fb: FormBuilder) {
    super(authenticationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.searchForm = this.fb.group({
      query: [''],
    });
    this.onScroll();
    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.reload();
      });

  }

  onSortClick(updatedSort: CompetenceCatalogSortValue) {
    this.sort = updatedSort;
    this.reload();
  }

  onScroll() {
    this.loadItems({
      query: this.searchForm.get('query').value || ''
    });
  }

  reload() {
    this.page = 0;
    this.items = [];
    this.onScroll();
  }

  protected loadItems(body: RequestBody) {
    this.itemsRepository.search({
      body,
      page: this.page++,
      size: DEFAULT_PAGE_SIZE,
      sort: this.mapSortField(),
    }).pipe(
    ).subscribe(response => {
      this.items = [...(this.items || []), ...response.content];
    });
  }

  private mapSortField() {
    switch (this.sort.type) {
      case SortType.DATE_DESC:
        return DEFAULT_SORT_OPTIONS.DATE_DESC;
      case SortType.DATE_ASC:
        return DEFAULT_SORT_OPTIONS.DATE_ASC;
      case SortType.ALPHA_DESC:
        return DEFAULT_SORT_OPTIONS.ALPHA_DESC;
      case SortType.ALPHA_ASC:
        return DEFAULT_SORT_OPTIONS.ALPHA_ASC;
    }
  }

  protected isItemDeletable(item: T): boolean {
    return !item.published;
  }

}
