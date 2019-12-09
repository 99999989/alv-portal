import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToText',
  pure: true
})
export class BooleanToTextPipe implements PipeTransform {

  transform(value: boolean, ...args: [string, string]): any {
    return value ? args[0] : args[1];
  }

}
