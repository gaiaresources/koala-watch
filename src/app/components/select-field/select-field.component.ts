import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FieldDescriptor } from "../../models/field-descriptor";
import { BaseFieldComponent } from "../base-field/base-field.component";
import { IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonText } from "@ionic/angular/standalone";
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    NgIf,
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,
    NgForOf,
    IonText,
  ]
})
export class SelectFieldComponent extends BaseFieldComponent {

}
