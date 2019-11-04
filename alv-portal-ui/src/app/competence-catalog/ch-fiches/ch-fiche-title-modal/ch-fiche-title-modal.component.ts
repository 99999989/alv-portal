import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import { TranslatedString } from '../../shared/shared-competence-catalog.types';

@Component({
  selector: 'alv-ch-fiche-title-modal',
  templateUrl: './ch-fiche-title-modal.component.html',
})
export class ChFicheTitleModalComponent implements OnInit {

  form: FormGroup;

  @Input()
  isReadonly = false;

  @Input()
  chFicheTitle: TranslatedString;

  formFields = ['textDe', 'textFr', 'textIt', 'textEn'];

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      textDe: [''],
      textFr: [''],
      textIt: [''],
      textEn: ['']
    }, {
      validators: [atLeastOneRequiredValidator(this.formFields)]
    });
    if (this.chFicheTitle) {
      this.form.patchValue(this.chFicheTitle);
    }
  }

  cancel() {
    this.modal.dismiss();
  }

  submit() {
    this.modal.close(this.form.value);
  }
}
