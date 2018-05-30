import { Component } from '@angular/core';

/**
 * Generated class for the RecordsMapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'records-map',
  templateUrl: 'records-map.html'
})
export class RecordsMapComponent {

  text: string;

  constructor() {
    console.log('Hello RecordsMapComponent Component');
    this.text = 'Hello World';
  }

}
