import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, ValidationErrors } from "@angular/forms";
import { FieldDescriptor } from "../../models/field-descriptor";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-base-field',
  templateUrl: './base-field.component.html',
  standalone: true,
})
export abstract class BaseFieldComponent implements OnInit, OnChanges {

  @Input()
  readonly: boolean = false;

  @Input({required: true})
  formGroup?: FormGroup;

  @Input({required: true})
  field?: FieldDescriptor;

  subscriptions: Subscription[] = [];
  error: string = "";

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    if (!this.formGroup || !this.field) return;

    const control = this.formGroup.get(this.field.key);
    if (!control) return;
    this.subscriptions.push(
      control.statusChanges.subscribe((status) => {
        this.error = this.processErrors(control.errors);
      }),
    );
  }

  public checkErrors() {
    if (!this.formGroup || !this.field) return;

    const control = this.formGroup.get(this.field.key);
    if (!control) return;
    this.error = this.processErrors(control.errors);
  }

  private processErrors(errors: ValidationErrors | null): string {
    if (!errors) {
      return "";
    }

    const errorKey = Object.keys(errors)[0];
    const error = errors[errorKey];

    switch (errorKey) {
      case 'required':
        return 'This field is required';
      case 'min':
        return `Minimum value: ${error['min']}`;
      case 'max':
        return `Maximum value: ${error['max']}`;
      case 'minLength':
        return `Minimum length: ${error['minLength']}`;
      case 'maxLength':
        return `Maximum length: ${error['maxLength']}`;
      case 'pattern':
        return `Must match pattern: ${error['pattern']}`;
      default:
        return `Unknown error result`;
    }
  }
}
