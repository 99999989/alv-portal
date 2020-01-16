import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SelectableOption } from '../../../../shared/forms/input/selectable-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceType } from '../../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';

@Component({
  selector: 'alv-competence-set-in-fiche-settings-modal',
  templateUrl: './competence-set-in-fiche-settings-modal.component.html',
  styleUrls: ['./competence-set-in-fiche-settings-modal.component.scss']
})
export class CompetenceSetInFicheSettingsModalComponent implements OnInit {

  categoriesOptions$: Observable<SelectableOption[]> = of(Object.values(CompetenceType).map(t => ({
    label: 'portal.competence-catalog.ch-fiches.label.' + t,
    value: t
  })));

  form: FormGroup;


  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  cancel() {
    this.activeModal.dismiss();
  }

  //
  // ngAfterViewInit() {
  //   this.form.get('statusFilters').patchValue(flagsToFilterByStatusesFormValueMapper(this.currentFiltering));
  // }

  ngOnInit() {
    this.form = this.fb.group({
      category: ['', Validators.required]
    });
  }

  submit() {

  }
}
