import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceCatalogSortValue, SortIcon, SortType } from '../../constants';

@Component({
  selector: 'alv-competence-catalog-sort-modal',
  templateUrl: './competence-catalog-sort-modal.component.html',
  styleUrls: ['./competence-catalog-sort-modal.component.scss']
})
export class CompetenceCatalogSortModalComponent implements OnInit {

  @Input()
  currentSorting: CompetenceCatalogSortValue;

  form: FormGroup;

  sortTypes$ = of([
    {
      label: 'portal.competence-catalog.sorting.created-date-desc',
      value: SortType.CREATED_DATE_DESC
    },
    {
      label: 'portal.competence-catalog.sorting.created-date-asc',
      value: SortType.CREATED_DATE_ASC
    },
    {
      label: 'portal.competence-catalog.sorting.alpha-desc',
      value: SortType.ALPHA_DESC
    },
    {
      label: 'portal.competence-catalog.sorting.alpha-asc',
      value: SortType.ALPHA_ASC
    }
  ]);

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      sort: [this.currentSorting.type, Validators.required]
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  sort() {
    const type: SortType = this.form.get('sort').value;
    let icon: SortIcon;
    switch (type) {
      case SortType.CREATED_DATE_DESC:
        icon = SortIcon.NUMERIC_DESC;
        break;
      case SortType.CREATED_DATE_ASC:
        icon = SortIcon.NUMERIC_UP;
        break;
      case SortType.ALPHA_DESC:
        icon = SortIcon.ALPHA_DESC;
        break;
      case SortType.ALPHA_ASC:
        icon = SortIcon.ALPHA_ASC;
        break;
    }
    const updatedSorting: CompetenceCatalogSortValue = { type, icon };
    this.activeModal.close(updatedSorting);
  }

}
