import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { draftRadioButtonOptions, publishedRadioButtonOptions } from '../constants';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { WorkflowFormValue } from '../shared-competence-catalog.types';

@Component({
  selector: 'alv-workflow-form[parentForm][workflowFormValue][isReadonly][isEdit]',
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit {
  @Input()
  parentForm: FormGroup;

  @Input()
  workflowFormValue: WorkflowFormValue;

  @Input()
  isReadonly: boolean;

  @Input()
  isEdit: boolean;

  publishedRadioButtonOptions$ = of(publishedRadioButtonOptions);

  draftRadioButtonOptions$ = of(draftRadioButtonOptions);

  isPublishable: boolean;


  published: FormControl;
  draft: FormControl;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.draft = this.fb.control(this.workflowFormValue.draft);
    this.published = this.fb.control(this.workflowFormValue.published);
    this.isPublishable = !this.workflowFormValue.draft;
    this.parentForm.addControl('draft', this.published);
    this.parentForm.addControl('published', this.draft);
  }


}
