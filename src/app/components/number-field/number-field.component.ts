import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {IonInput, IonItem, IonText} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {BaseFieldComponent} from "../base-field/base-field.component";

@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonText,
    NgIf,
    ReactiveFormsModule,
    IonItem
  ]
})
export class NumberFieldComponent extends BaseFieldComponent {

}
