import { ANY_ANGULAR_DATE_FORMAT, ANY_MOMENT_DATE_FORMAT, ISO_ANGULAR_DATE_FORMAT, ISO_MOMENT_DATE_FORMAT } from './consts';

import { APIError, User } from '../interfaces/api.interfaces';

export function pyDateFormatToAngularDateFormat(pythonDateFormat: string): string {
    let ngDateFormat = pythonDateFormat;

    if (!ngDateFormat || ngDateFormat === 'any') {
        return ANY_ANGULAR_DATE_FORMAT;
    } else if (ngDateFormat === 'default') {
        return ISO_ANGULAR_DATE_FORMAT;
    }

    ngDateFormat = ngDateFormat.replace(/fmt:/, '');
    ngDateFormat = ngDateFormat.replace(/%a/, 'EEE');
    ngDateFormat = ngDateFormat.replace(/%A/, 'EEEE');
    ngDateFormat = ngDateFormat.replace(/%d/, 'dd');
    ngDateFormat = ngDateFormat.replace(/%b/, 'MMM');
    ngDateFormat = ngDateFormat.replace(/%B/, 'MMMM');
    ngDateFormat = ngDateFormat.replace(/%m/, 'MM');
    ngDateFormat = ngDateFormat.replace(/%y/, 'yy');
    ngDateFormat = ngDateFormat.replace(/%Y/, 'yyyy');

    return ngDateFormat;
}

export function pyDateFormatToMomentDateFormat(pythonDateFormat: string): string {
    let momentDateFormat = pythonDateFormat;

    if (!momentDateFormat || momentDateFormat === 'any') {
        return ANY_MOMENT_DATE_FORMAT;
    } else if (momentDateFormat === 'default') {
        return ISO_MOMENT_DATE_FORMAT;
    }

    momentDateFormat = momentDateFormat.replace(/fmt:/, '');
    momentDateFormat = momentDateFormat.replace(/%a/, 'dd');
    momentDateFormat = momentDateFormat.replace(/%A/, 'dddd');
    momentDateFormat = momentDateFormat.replace(/%d/, 'DD');
    momentDateFormat = momentDateFormat.replace(/%b/, 'MMM');
    momentDateFormat = momentDateFormat.replace(/%B/, 'MMMM');
    momentDateFormat = momentDateFormat.replace(/%m/, 'MM');
    momentDateFormat = momentDateFormat.replace(/%y/, 'YY');
    momentDateFormat = momentDateFormat.replace(/%Y/, 'YYYY');

    return momentDateFormat;
}

export function formatAPIError(error: APIError): object {
    let errObj:  object | string[] | string = error.msg || {};
    // normally should be an object with field name as keys {field1: [messages], field2: [messages]}
    // if it is an error not related to a field it would have the key 'non_field_errors'.
    // use this key as a catch all error.
    if (Array.isArray(errObj)) {
        errObj = {non_field_errors: errObj};
    } else if (typeof errObj === 'string') {
        errObj = {non_field_errors: [errObj]};
    }
    return errObj;
}

export function formatUserFullName(user: User): string {
    return `${user.first_name} ${user.last_name}`.trim() || `${user.username}`.trim();
}
