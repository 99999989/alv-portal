import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { draftRadioButtonOptions, publishedRadioButtonOptions } from '../constants';
import { FormGroup } from '@angular/forms';
import { WorkflowFormValue } from '../shared-competence-catalog.types';

@Component({
  selector: 'alv-workflow-form',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit {

  publishedRadioButtonOptions$ = of(publishedRadioButtonOptions);

  draftRadioButtonOptions$ = of(draftRadioButtonOptions);

  isPublishable: boolean;

  @Input()
  parentForm: FormGroup;
  @Input()
  workflowFormValue: WorkflowFormValue;

  @Input()
  isReadonly: boolean;

  @Input()
  isEdit: boolean;

  constructor() {
  }

  ngOnInit() {
    this.isPublishable = !this.workflowFormValue.draft;
    this.parentForm.addControl('draft', this.workflowFormValue.draft);
    this.parentForm.addControl('published', this.workflowFormValue.published);
  }


}
