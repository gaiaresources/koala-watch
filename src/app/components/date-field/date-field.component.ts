import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FieldDescriptor} from "../../models/field-descriptor";
import {IonDatetime, IonDatetimeButton, IonItem, IonLabel, IonModal} from "@ionic/angular/standalone";
import {ClassifyPipe} from "../../pipes/classify/classify.pipe";
import {HelpButtonComponent} from "../help-button/help-button.component";

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
    DatePipe,
    IonItem,
    HelpButtonComponent,
  ]
})
export class DateFieldComponent implements OnInit {

  @Input()
  readonly: boolean = false;

  @Input({required: true})
  formGroup?: FormGroup;

  @Input({required: true})
  field?: FieldDescriptor;

  currentDate = new Date();

  constructor() {
  }

  ngOnInit() {
  }

}
