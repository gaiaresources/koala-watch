import { Component } from '@angular/core';

/**
 * Generated class for the RecordsListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'records-list',
  templateUrl: 'records-list.html'
})
export class RecordsListComponent {

  text: string;

  constructor() {
    console.log('Hello RecordsListComponent Component');
    this.text = 'Hello World';
  }

}
