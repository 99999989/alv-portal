export const URL_REGEX = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

/*
    http://emailregex.com/
 */
export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PHONE_NUMBER_REGEX = /^[+]\d+$/;

export const POSTBOX_NUMBER_REGEX = /^\d{0,6}$/;

export const HOUSE_NUMBER_REGEX = /^\d+[a-zA-Z]*$/;

export const PERSON_NUMBER_REGEX = /^\d{8}$/;

export const ONE_TWO_DIGIT_INTEGER_REGEX = /^[1-9][0-9]?$/;

/*
 * Checks if the input contains only numbers and the value is greater then 0
 */
export const POSITIVE_INTEGER_REGEX = /^[1-9][0-9]*$/;

export const COMPANY_UID_REGEX = /^CHE\-[0-9]{3}\.[0-9]{3}\.[0-9]{3}$/;
