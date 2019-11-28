export function getModalTitle(isReadonly: boolean, isEdit: boolean): string {
  if (isReadonly) {
    return 'entity.action.view';
  }
  if (isEdit) {
    return 'entity.action.edit';
  } else {
    return 'portal.global.enter';
  }
}
