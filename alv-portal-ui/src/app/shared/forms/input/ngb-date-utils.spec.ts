import { daysAfterEndOfMonth, fromDate, fromISODate, toISOLocalDate, toISOLocalDateTime } from './ngb-date-utils';

describe('NgbDateUtils tests', () => {

  const TESTING_DATE_STRING_1 = '2000-12-11';
  const TESTING_DATE_STRING_2 = '2000-01-01';
  const TESTING_DATE_STRING_3 = '2000-1-1';

  const TESTING_DATE_TIME_STRING_1 = '2008-09-15T15:53:00+05:00';
  const TESTING_DATE_TIME_STRING_2 = '2007-12-24T18:21Z';

  const TESTING_DATE_1 = new Date(2000, 1, 12);
  const TESTING_DATE_2 = new Date(2000, 0, 1);
  const TESTING_DATE_3 = new Date('July 22, 2018 07:22:13');
  const TESTING_DATE_4 = new Date('25 March 2018');


  // Date -> localDateTimeString

  it('should convert Date to ISOLocalDateTime string representation #1', () => {
    const convertedLocalDateTimeString = toISOLocalDateTime(fromDate(TESTING_DATE_1), '14', '15');
    expect(convertedLocalDateTimeString).toContain('2000-02-12T14:15:00');
  });

  it('should convert Date to ISOLocalDateTime string representation #2', () => {
    const convertedLocalDateTimeString = toISOLocalDateTime(fromDate(TESTING_DATE_2), '21', '00');
    expect(convertedLocalDateTimeString).toContain('2000-01-01T21:00:00');
  });

  it('should convert Date to ISOLocalDateTime string representation #3', () => {
    const convertedLocalDateTimeString = toISOLocalDateTime(fromDate(TESTING_DATE_3), '13', '00');
    expect(convertedLocalDateTimeString).toContain('2018-07-22T13:00:00');
  });

  it('should convert Date to ISOLocalDateTime string representation #4', () => {
    const convertedLocalDateTimeString = toISOLocalDateTime(fromDate(TESTING_DATE_4), '11', '00');
    expect(convertedLocalDateTimeString).toContain('2018-03-25');
  });

  it('should convert null Date to null', () => {
    const convertedLocalDateTimeString = toISOLocalDateTime(null, '11', '00');
    expect(convertedLocalDateTimeString).toBe(null);
  });


  // Date -> NgbDateStruct

  it('should convert Date to NgbDateStruct  #1', () => {
    const convertedNgbDateStruct = fromDate(TESTING_DATE_1);
    expect(convertedNgbDateStruct.year).toEqual(2000);
    expect(convertedNgbDateStruct.month).toEqual(2);
    expect(convertedNgbDateStruct.day).toEqual(12);
  });

  it('should convert Date to NgbDateStruct #2', () => {
    const convertedNgbDateStruct = fromDate(TESTING_DATE_2);
    expect(convertedNgbDateStruct.year).toEqual(2000);
    expect(convertedNgbDateStruct.month).toEqual(1);
    expect(convertedNgbDateStruct.day).toEqual(1);
  });

  it('should convert Date to NgbDateStruct #3', () => {
    const convertedNgbDateStruct = fromDate(TESTING_DATE_3);
    expect(convertedNgbDateStruct.year).toEqual(2018);
    expect(convertedNgbDateStruct.month).toEqual(7);
    expect(convertedNgbDateStruct.day).toEqual(22);
  });

  it('should convert Date to NgbDateStruct #4', () => {
    const convertedNgbDateStruct = fromDate(TESTING_DATE_4);
    expect(convertedNgbDateStruct.year).toEqual(2018);
    expect(convertedNgbDateStruct.month).toEqual(3);
    expect(convertedNgbDateStruct.day).toEqual(25);
  });

  it('should convert null Date to null', () => {
    const convertedNgbDateStruct = fromDate(null);
    expect(convertedNgbDateStruct).toBe(null);
  });


  // NgbDateStruct -> ISOLocalDate string representation

  it('should convert NgbDateStruct to ISOLocalDate string representation #1', () => {
    const ISOLocalDateString = toISOLocalDate(fromDate(TESTING_DATE_1));
    expect(ISOLocalDateString).toContain('2000-02-12');

  });

  it('should convert NgbDateStruct to ISOLocalDate string representation #2', () => {
    const ISOLocalDateString = toISOLocalDate(fromDate(TESTING_DATE_2));
    expect(ISOLocalDateString).toContain('2000-01-01');
  });

  it('should convert NgbDateStruct to ISOLocalDate string representation #3', () => {
    const ISOLocalDateString = toISOLocalDate(fromDate(TESTING_DATE_3));
    expect(ISOLocalDateString).toContain('2018-07-22');
  });

  it('should convert NgbDateStruct to ISOLocalDate string representation #4', () => {
    const ISOLocalDateString = toISOLocalDate(fromDate(TESTING_DATE_4));
    expect(ISOLocalDateString).toContain('2018-03-25');
  });

  it('should convert null NgbDateStruct to null', () => {
    const ISOLocalDateString = toISOLocalDate(fromDate(null));
    expect(ISOLocalDateString).toBe(null);
  });


  // ISODate string representation -> NgbDateStruct

  it('should convert ISODate string representation to NgbDateStruct #1', () => {
    const convertedNgbDateStruct = fromISODate(TESTING_DATE_STRING_1);
    expect(convertedNgbDateStruct.year).toEqual(2000);
    expect(convertedNgbDateStruct.month).toEqual(12);
    expect(convertedNgbDateStruct.day).toEqual(11);
  });

  it('should convert ISODate string representation to NgbDateStruct #2', () => {
    const convertedNgbDateStruct = fromISODate(TESTING_DATE_STRING_2);
    expect(convertedNgbDateStruct.year).toEqual(2000);
    expect(convertedNgbDateStruct.month).toEqual(1);
    expect(convertedNgbDateStruct.day).toEqual(1);
  });

  it('should convert ISODate string representation to NgbDateStruct #3', () => {
    const convertedNgbDateStruct = fromISODate(TESTING_DATE_STRING_3);
    expect(convertedNgbDateStruct.year).toEqual(2000);
    expect(convertedNgbDateStruct.month).toEqual(1);
    expect(convertedNgbDateStruct.day).toEqual(1);
  });

  it('should convert null ISODate string representation to null', () => {
    const convertedNgbDateStruct = fromISODate(null);
    expect(convertedNgbDateStruct).toBe(null);
  });

  // ISODateTime string representation -> ISOLocalDate string Representation

  it('should convert LocalDateTime string representation to ISOLocalDate string representation #1', () => {
    const convertedLocalDateTimeString = toISOLocalDate(fromISODate(TESTING_DATE_TIME_STRING_1));
    expect(convertedLocalDateTimeString).toContain('2008-09-15');
  });

  it('should convert LocalDateTime string representation to ISOLocalDate string representation #2', () => {
    const convertedLocalDateTimeString = toISOLocalDate(fromISODate(TESTING_DATE_TIME_STRING_2));
    expect(convertedLocalDateTimeString).toContain('2007-12-24');
  });

  it('should convert null LocalDateTime string representation to null', () => {
    const convertedLocalDateTimeString = toISOLocalDate(fromISODate(null));
    expect(convertedLocalDateTimeString).toBe(null);
  });

  it('should calculate daysAfterEndOfMonth for currentMonth and specified noOfMonth = 5', () => {
    const expectedDay = 5;
    const date = daysAfterEndOfMonth(expectedDay);
    expect(date.getFullYear()).toBe(new Date().getFullYear());
    expect(date.getMonth()).toBe(new Date().getMonth() + 1);
    expect(date.getDate()).toBe(expectedDay);
  });

  it('should calculate daysAfterEndOfMonth for currentMonth and specified noOfMonth = 15', () => {
    const expectedDay = 15;
    const date = daysAfterEndOfMonth(expectedDay);
    expect(date.getFullYear()).toBe(new Date().getFullYear());
    expect(date.getMonth()).toBe(new Date().getMonth() + 1);
    expect(date.getDate()).toBe(expectedDay);
  });

});
