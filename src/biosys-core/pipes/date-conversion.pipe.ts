import { Pipe, PipeTransform } from '@angular/core';
import { pyDateFormatToAngularDateFormat } from '../utils/functions';

@Pipe({name: 'pyDateFormatToAngularDateFormat'})
export class PyToAngularDateFormatConversionPipe implements PipeTransform {
    transform(value: string): string {
        return pyDateFormatToAngularDateFormat(value);
    }
}
