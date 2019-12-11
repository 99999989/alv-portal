import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'alv-filter-by-statuses-form',
  templateUrl: './filter-by-statuses-form.component.html',
  styleUrls: ['./filter-by-statuses-form.component.scss']
})
export class FilterByStatusesFormComponent implements OnInit {

  @Input()
  parentForm: FormGroup;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      published: [''],
      notPublished: [''],
      approved: [''],
      draft: ['']
    });
    this.parentForm.addControl('statusFilters', this.form);
  }

}
