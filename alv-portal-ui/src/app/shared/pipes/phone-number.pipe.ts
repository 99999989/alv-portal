import { Pipe, PipeTransform } from '@angular/core';
import { CountryCode, format, isValidNumber, parse, } from 'libphonenumber-js';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(value: string, country: CountryCode = 'CH'): string {
    if (value && isValidNumber(value, country)) {
      const parsedNumber = parse(value, country);
      return format(parsedNumber, 'International');
    }
    return value;
  }
}
