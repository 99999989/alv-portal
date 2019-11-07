import { OnInit } from '@angular/core';
import { AuthenticationService } from '../../../core/auth/authentication.service';
import { CompetenceCatalogEditorAwareComponent } from '../competence-catalog-editor-aware/competence-catalog-editor-aware.component';
import { SearchService } from '../../../shared/backend-services/competence-catalog/search-service';
import { DEFAULT_PAGE_SIZE, DEFAULT_SORT } from '../constants';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { RequestBody } from '../../../shared/backend-services/request-util';


export class OverviewComponent<T> extends CompetenceCatalogEditorAwareComponent implements OnInit {


  searchForm: FormGroup;

  items: T[];

  sortAsc = true;

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
      takeUntil(this.ngUnsubscribe))
      .subscribe(value => {
        this.reload();
      });
    // this.searchForm.valueChanges.subscribe(x => console.log(x));

  }

  onSortClick() {
    this.sortAsc = !this.sortAsc;
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
      sort: this.sortAsc ? DEFAULT_SORT.asc : DEFAULT_SORT.desc,
    }).pipe(
    ).subscribe(response => {
      this.items = [...(this.items || []), ...response.content];
    });
  }

}
