import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {IonInput, IonItem, IonText} from "@ionic/angular/standalone";
import {BaseFieldComponent} from "../base-field/base-field.component";

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
