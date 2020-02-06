import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SelectableOption } from '../../../../shared/forms/input/selectable-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceType } from '../../../../shared/backend-services/competence-catalog/ch-fiche/ch-fiche.types';

const competenceTypeToRadioButtonOption = (t) => ({
  label: 'portal.competence-catalog.ch-fiches.label.' + t,
  value: t
});

@Component({
  selector: 'alv-competence-set-in-fiche-settings-modal',
  templateUrl: './competence-set-in-fiche-settings-modal.component.html',
  styleUrls: ['./competence-set-in-fiche-settings-modal.component.scss']
})
export class CompetenceSetInFicheSettingsModalComponent implements OnInit {

  competenceTypeOptions$: Observable<SelectableOption[]> = of(Object.values(CompetenceType).map(competenceTypeToRadioButtonOption)
  );

  form: FormGroup;

  @Input()
  competenceType: CompetenceType;


  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  cancel() {
    this.activeModal.dismiss();
  }

  ngOnInit() {
    this.form = this.fb.group({
      competenceType: [this.competenceType, Validators.required]
    });
  }

  submit() {
    this.activeModal.close(this.form.get('competenceType').value);
  }
}
