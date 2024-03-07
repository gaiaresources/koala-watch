import { Pipe, PipeTransform } from '@angular/core';
import { pyDateFormatToIonicDateFormat } from '..//utils/functions';

@Pipe({name: 'pyDateFormatToIonicDateFormat'})
export class PyToIonicDateFormatConversionPipe implements PipeTransform {
    transform(value: string): string {
        return pyDateFormatToIonicDateFormat(value);
    }
}
