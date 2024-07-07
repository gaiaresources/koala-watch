import { Injectable } from '@angular/core';
import {AuthenticationService} from "../authentication/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class ComputedFieldService {

  constructor(
    private authenticationService: AuthenticationService,
  ) { }

  getComputedValue(field: any, value: any) {
    switch (field.computed) {
      case 'user':
        return '';
      default:
        return value;
    }
  }
}
