import {Injectable} from '@angular/core';
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class ComputedFieldService {

  constructor() {
  }

  getComputedValue(field: any, value: any, user: User | null) {
    switch (field.computed) {
      case 'user':
        if (user) {
          return user.first_name + ' ' + user.last_name;
        }
        return '';
      default:
        return value;
    }
  }
}
