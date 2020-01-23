import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByKeyValue',
  pure: false
})
export class FilterByKeyValuePipe implements PipeTransform {
  transform(arr: any[], filterObject: Record<string, any>): any[] {
    if (!arr || !filterObject) {
      return arr;
    }
    const ownProperties = Object.getOwnPropertyNames(filterObject);
    if (ownProperties.length !== 1) {
      return arr;
    }
    const propertyName = ownProperties[0];
    return arr.filter(item => item[propertyName] === filterObject[propertyName]);
  }
}
