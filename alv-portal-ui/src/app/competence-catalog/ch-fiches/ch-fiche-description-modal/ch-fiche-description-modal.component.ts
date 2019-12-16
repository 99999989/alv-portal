import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import { TranslatedString } from '../../shared/shared-competence-catalog.types';

@Component({
  selector: 'alv-ch-fiche-description-modal',
  templateUrl: './ch-fiche-description-modal.component.html',
})
export class ChFicheDescriptionModalComponent implements OnInit {

  form: FormGroup;

  @Input()
  isReadonly = false;

  @Input()
  chFicheDescription: TranslatedString;

  formFields = ['de', 'fr', 'it', 'en'];

  constructor(private modal: NgbActiveModal,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      de: [''],
      fr: [''],
      it: [''],
      en: ['']
    }, {
      validators: [atLeastOneRequiredValidator(this.formFields)]
    });
    if (this.chFicheDescription) {
      this.form.patchValue(this.chFicheDescription);
    }
  }

  cancel() {
    this.modal.dismiss();
  }

  submit() {
    this.modal.close(this.form.value);
  }
}
