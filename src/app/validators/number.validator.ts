import {AbstractControl, ValidationErrors} from "@angular/forms";

export class NumberValidator {

  static integer(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasValidNumber = /^[-+]?[0-9]+$/.test(value);
    return !hasValidNumber ? {invalidInteger: true} : null;
  };

  static decimal(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasValidNumber = /^[-+]?[0-9]+(\.[0-9]{1,9})?$/.test(value);
    return !hasValidNumber ? {invalidDecimal: true} : null;
  };
}
