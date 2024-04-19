import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class PasswordValidator {
  static password(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const errors: any = {};
    if (value.indexOf('>') >= 0 || value.indexOf('<') >= 0) {
      errors.invalidChars = true;
    }
    if (!/[a-z]/.test(value)) {
      errors.noLowerCase = true;
    }
    if (!/[A-Z]/.test(value)) {
      errors.noUpperCase = true;
    }
    if (!/[0-9]/.test(value)) {
      errors.noDigit = true;
    }
    return Object.keys(errors).length ? errors : null;
  };

  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({matching: true});
        return {matching: true};
      } else {
        return null;
      }
    };
  }

}
