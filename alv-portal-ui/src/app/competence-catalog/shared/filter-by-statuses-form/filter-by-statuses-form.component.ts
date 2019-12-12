import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';

export interface FilterByStatusesFormValue {
  published: {
    published: boolean;
    notPublished: boolean;
  };
  draft: {
    approved: boolean;
    draft: boolean;
  };
}

export interface StatusFlags {
  draft?: boolean;
  published?: boolean;
}

export function filterByStatusesFormValueToRequestMapper(formValue: FilterByStatusesFormValue): HttpParams {
  const params = new HttpParams();
  if (!(formValue.published.published === formValue.published.notPublished)) {
    params.set('published', String(Boolean(formValue.published.published)));
  }
  if (!(formValue.draft.draft && formValue.draft.approved)) {
    params.set('draft', String(Boolean(formValue.draft.draft)));
  }
  return params;
}

export function filterByStatusesFormValueToFlagsMapper(formValue: FilterByStatusesFormValue): StatusFlags {
  const res: StatusFlags = {};
  if (!(formValue.published.published === formValue.published.notPublished)) {
    res.published = Boolean(formValue.published.published);
  }
  if (!(formValue.draft.draft && formValue.draft.approved)) {
    res.draft = Boolean(formValue.draft.draft);
  }
  return res;
}

export function flagsToFilterByStatusesFormValueMapper(flags: StatusFlags): FilterByStatusesFormValue {
  return {
    published: {
      published: !flags.hasOwnProperty('published') ? true : Boolean(flags.published),
      notPublished: !flags.hasOwnProperty('published') ? true : !Boolean(flags.published)
    },
    draft: {
      draft: !flags.hasOwnProperty('draft') ? true : Boolean(flags.draft),
      approved: !flags.hasOwnProperty('draft') ? true : !Boolean(flags.draft),
    }
  };
}

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
      published: this.fb.group({
          published: [''],
          notPublished: ['']
        }
      ),
      draft: this.fb.group({
        approved: [''],
        draft: ['']
      })
    });
    this.parentForm.addControl('statusFilters', this.form);
  }

}
