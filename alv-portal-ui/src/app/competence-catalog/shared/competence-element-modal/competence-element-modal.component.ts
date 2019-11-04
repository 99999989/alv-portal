import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { atLeastOneRequiredValidator } from '../../../shared/forms/input/validators/at-least-one-required.validator';
import { SelectableOption } from '../../../shared/forms/input/selectable-option.model';
import {
  CompetenceElement,
  ElementType
} from '../../../shared/backend-services/competence-element/competence-element.types';
import { Observable, of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenceElementRepository } from '../../../shared/backend-services/competence-element/competence-element.repository';
import { NotificationsService } from '../../../core/notifications.service';
import { getModalTitle } from '../utils/translation-utils';

@Component({
  selector: 'alv-competence-element-modal',
  templateUrl: './competence-element-modal.component.html',
  styleUrls: ['./competence-element-modal.component.scss']
})
export class CompetenceElementModalComponent implements OnInit {

  @Input() competenceElement: CompetenceElement;

  @Input() isReadonly = false;

  typeOptions$: Observable<SelectableOption[]> = of([{
      value: null,
      label: 'portal.competence-catalog.competence-elements.add-modal.choose-type'
    }
    ].concat(Object.values(ElementType).map(type => {
      return {
        label: 'portal.competence-catalog.element-type.' + type,
        value: type
      };
    }))
  );

  form: FormGroup;

  modalTitle: string;

  isEdit = false;

  constructor(private fb: FormBuilder,
              private competenceElementRepository: CompetenceElementRepository,
              private notificationsService: NotificationsService,
              private modal: NgbActiveModal) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      type: [null, Validators.required],
      description: this.fb.group({
        textDe: [''],
        textFr: [''],
        textIt: [''],
        textEn: ['']
      }, {
        validators: [atLeastOneRequiredValidator(['textDe', 'textFr', 'textIt', 'textEn'])]
      })
    });
    if (this.competenceElement) {
      this.form.patchValue(this.competenceElement);
      this.isEdit = true;
    }
    this.modalTitle = getModalTitle(this.isReadonly, this.isEdit);
  }

  submit() {
    if (this.isEdit) {
      this.updateElement();
    } else {
      this.createElement();
    }
  }


  cancel() {
    this.modal.dismiss();
  }

  private updateElement() {
    this.competenceElementRepository.update(this.competenceElement.id, {
      description: this.form.get('description').value,
      draft: this.competenceElement.draft,
      published: this.competenceElement.published
    })
      .subscribe(this.handleSuccess.bind(this));
  }

  private createElement() {
    this.competenceElementRepository.create(this.form.value)
      .subscribe(this.handleSuccess.bind(this));
  }

  private handleSuccess(result) {
    this.notificationsService.success('portal.competence-catalog.competence-elements.add-modal.added-success-notification');
    this.modal.close(result);
  }
}
