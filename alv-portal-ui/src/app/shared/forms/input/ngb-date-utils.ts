import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { addDays, endOfMonth, format, startOfToday, subDays } from 'date-fns';

/**
 * Converts a NgbDateStruct with hours and minutes parameters to an (8601) ISOLocalDatetime string representation without timezone information
 * f.E <NgbDateStruct>{day: 12, month: 2, year: 2000}, 14, 15) = '2000-02-12T14:15:00'

 * @param date
 * @param timeHours
 * @param timeMinutes
 */
export function toISOLocalDateTime(date: NgbDateStruct, timeHours: string, timeMinutes: string): string {
  if (!date) {
    return null;
  }
  const dateObj = new Date(date.year, date.month - 1, date.day, parseInt(timeHours, 10), parseInt(timeMinutes, 10));
  return format(dateObj, 'YYYY-MM-DDTHH:mm:00');
}

/**
 * Converts a NgbDateStruct to an (8601) ISOLocalDate string representation
 * f.E <NgbDateStruct>{day: 12, month: 2, year: 2000} = '2000-02-12'
 *
 * @param date
 */
export function toISOLocalDate(date: NgbDateStruct): string {
  if (!date) {
    return null;
  }
  const dateObj = new Date(date.year, date.month - 1, date.day, 12);
  return format(dateObj, 'YYYY-MM-DD');
}

/**
 * Converts a Date to a NgbDateStruct
 * f.E fromDate(new Date(2000, 0, 1)); = <NgbDateStruct>{day: 1, month: 1, year: 2000}
 * @param date
 */
export function fromDate(date: Date): NgbDateStruct {
  if (!date) {
    return null;
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}

/**
 * Converts an (8601) ISODateString to a NgbDateStruct
 * f.E  '2000-12-11' = <NgbDateStruct>{day: 11, month: 12, year: 2000}
 * @param isoDateString
 */
export function fromISODate(isoDateString: string): NgbDateStruct {
  if (!isoDateString) {
    return null;
  }
  return fromDate(new Date(isoDateString));
}

export function now(): NgbDateStruct {
  return fromDate(new Date());
}

export function tomorrow(): NgbDateStruct {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return fromDate(date);
}

/**
 * allows to add and subtract the dates. Takes the input date and adds days, months and years to it
 * for example:
 * @example deltaDate(new Date, 0, -2, 0) will return the date that is 2 months before today
 * @example deltaDate(new Date, 4, 0, 0) will return the date that is 4 months after today
 * @param input date
 * @param days
 * @param months
 * @param years
 */
export function deltaDate(input: Date, days: number, months: number, years: number): Date {
  const date = new Date(input);
  date.setDate(date.getDate() + days);
  date.setMonth(date.getMonth() + months);
  date.setFullYear(date.getFullYear() + years);
  return date;
}


/**
 * @param date
 */
export function mapDateToNgbDate(date: Date): NgbDate {
  return NgbDate.from(fromDate(date));
}

/**
 * subtracting noOfDays from the end of the current month
 * f.e. for December and noOfDays = 5, it would return 27.12.yyyy
 * f.e. for April and noOfDays = 5, it would return 26.04.yyyy
 *
 * @param noOfDays
 */
export function daysBeforeEndOfMonth(noOfDays: number): Date {
  return subDays(endOfMonth(startOfToday()), (noOfDays - 1));
}

/**
 * adding noOfDays from the end of the current month
 * f.e. for December and noOfDays = 5, it would return 05.01.yyyy
 * f.e. for April and noOfDays = 5, it would return 05.05.yyyy
 *
 * @param noOfDays
 */
export function daysAfterEndOfMonth(noOfDays: number): Date {
  return addDays(endOfMonth(startOfToday()), noOfDays);
}
