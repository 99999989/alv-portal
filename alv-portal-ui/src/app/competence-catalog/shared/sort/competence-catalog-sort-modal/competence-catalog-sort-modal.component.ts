import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectableOption } from '../../../../shared/forms/input/selectable-option.model';
import { CompetenceCatalogSortValue, SortIcon, SortType } from '../../shared-competence-catalog.types';

@Component({
  selector: 'alv-competence-catalog-sort-modal',
  templateUrl: './competence-catalog-sort-modal.component.html',
  styleUrls: ['./competence-catalog-sort-modal.component.scss']
})
export class CompetenceCatalogSortModalComponent implements OnInit {

  @Input()
  currentSorting: CompetenceCatalogSortValue;

  form: FormGroup;

  sortTypes$: Observable<SelectableOption[]> = of(Object.values(SortType)
    .map(s => ({
      label: 'portal.competence-catalog.sorting.' + s,
      value: s
    }))
  );

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
        icon = SortIcon.NUMERIC_UP;
        break;
      case SortType.CREATED_DATE_ASC:
        icon = SortIcon.NUMERIC_DOWN;
        break;
      case SortType.ALPHA_DESC:
        icon = SortIcon.ALPHA_UP;
        break;
      case SortType.ALPHA_ASC:
        icon = SortIcon.ALPHA_DOWN;
        break;
    }
    const updatedSorting: CompetenceCatalogSortValue = { type, icon };
    this.activeModal.close(updatedSorting);
  }

}
