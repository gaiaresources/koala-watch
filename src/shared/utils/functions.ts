import { ANY_IONIC_DATETIME_FORMAT, ISO_IONIC_DATETIME_FORMAT } from './consts';

export function pyDateFormatToIonicDateFormat(pythonDateFormat: string): string {
    let ionicDateFormat = pythonDateFormat;

    if (!ionicDateFormat || ionicDateFormat === 'any') {
        return ANY_IONIC_DATETIME_FORMAT;
    } else if (ionicDateFormat === 'default') {
        return ISO_IONIC_DATETIME_FORMAT;
    }

    ionicDateFormat = ionicDateFormat.replace(/fmt:/, '');
    ionicDateFormat = ionicDateFormat.replace(/%S/, 'ss');
    ionicDateFormat = ionicDateFormat.replace(/%M/, 'mm');
    ionicDateFormat = ionicDateFormat.replace(/%H/, 'HH');
    ionicDateFormat = ionicDateFormat.replace(/%a/, 'DDD');
    ionicDateFormat = ionicDateFormat.replace(/%A/, 'DDDD');
    ionicDateFormat = ionicDateFormat.replace(/%d/, 'DD');
    ionicDateFormat = ionicDateFormat.replace(/%b/, 'MMM');
    ionicDateFormat = ionicDateFormat.replace(/%B/, 'MMMM');
    ionicDateFormat = ionicDateFormat.replace(/%m/, 'MM');
    ionicDateFormat = ionicDateFormat.replace(/%y/, 'YY');
    ionicDateFormat = ionicDateFormat.replace(/%Y/, 'YYYY');

    return ionicDateFormat;
}

export function isDatasetCensus(dsName: string) {
    return dsName.toLowerCase().indexOf('census') > -1;
}
