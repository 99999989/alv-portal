import {
  FilterByStatusesFormValue,
  StatusFlags
} from './filter-by-statuses-form/filter-by-statuses-form.component';

export function filterByStatusesFormValueToFlagsMapper(formValue: FilterByStatusesFormValue): StatusFlags {
  const res: StatusFlags = {};
  if (!(formValue.published.published === formValue.published.notPublished)) {
    res.published = Boolean(formValue.published.published);
  }
  if (!(formValue.draft.draft === formValue.draft.approved)) {
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
