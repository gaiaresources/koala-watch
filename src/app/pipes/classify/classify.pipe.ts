import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classify',
  standalone: true
})
export class ClassifyPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.replace(' ', '-').toLowerCase();
  }

}
