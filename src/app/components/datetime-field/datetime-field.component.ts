import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FieldDescriptor } from "../../models/field-descriptor";

@Component({
  selector: 'app-datetime-field',
  templateUrl: './datetime-field.component.html',
  styleUrls: ['./datetime-field.component.scss'],
  standalone: true,
})
export class DatetimeFieldComponent implements OnInit {

  @Input()
  readonly: boolean = false;

  @Input({required: true})
  formGroup?: FormGroup;

  @Input({required: true})
  field?: FieldDescriptor;

  constructor() {
  }

  ngOnInit() {
  }

}
