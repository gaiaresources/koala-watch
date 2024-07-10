import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FieldDescriptor} from "../../models/field-descriptor";
import {IonicModule} from "@ionic/angular";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-hidden-field',
  templateUrl: './hidden-field.component.html',
  styleUrls: ['./hidden-field.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    ReactiveFormsModule,
    JsonPipe
  ]
})
export class HiddenFieldComponent implements OnInit {

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
