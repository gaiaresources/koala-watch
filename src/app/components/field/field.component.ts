import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FieldDescriptor } from "../../models/field-descriptor";
import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { IntegerFieldComponent } from "../integer-field/integer-field.component";
import { IonicModule } from "@ionic/angular";
import { NumberFieldComponent } from "../number-field/number-field.component";
import { TextFieldComponent } from "../text-field/text-field.component";
import { SelectFieldComponent } from "../select-field/select-field.component";
import { DatetimeFieldComponent } from "../datetime-field/datetime-field.component";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    IntegerFieldComponent,
    NgSwitchCase,
    NumberFieldComponent,
    TextFieldComponent,
    NgSwitchDefault,
    NgSwitch,
    SelectFieldComponent,
    DatetimeFieldComponent
  ]
})
export class FieldComponent {

  @Input()
  readonly: boolean = false;

  @Input({required: true})
  formGroup?: FormGroup;

  @Input({required: true})
  field?: FieldDescriptor;

}
