import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { NgIf } from "@angular/common";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FieldDescriptor } from "../../models/field-descriptor";
import { IonInput, IonItem, IonText } from "@ionic/angular/standalone";
import { BaseFieldComponent } from "../base-field/base-field.component";

@Component({
  selector: 'app-integer-field',
  templateUrl: './integer-field.component.html',
  styleUrls: ['./integer-field.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    IonInput,
    IonText,
    IonItem
  ]
})
export class IntegerFieldComponent extends BaseFieldComponent {

}
