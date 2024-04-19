import { AbstractControl, ValidationErrors } from "@angular/forms";

export class UsernameValidator {
  static username(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasValidUsername = /^[\w.@+-]+$/.test(value);
    return !hasValidUsername ? {invalidUsername: true} : null;
  };
}
