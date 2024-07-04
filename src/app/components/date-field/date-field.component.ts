import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from "@angular/common";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FieldDescriptor } from "../../models/field-descriptor";
import { IonicModule } from "@ionic/angular";
import {IonDatetime, IonDatetimeButton, IonLabel, IonModal} from "@ionic/angular/standalone";
import {ClassifyPipe} from "../../pipes/classify/classify.pipe";

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    IonLabel,
    IonDatetime,
    ReactiveFormsModule,
    IonDatetimeButton,
    IonModal,
    ClassifyPipe,
  ]
})
export class DateFieldComponent implements OnInit {

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
