import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {IonInput, IonItem, IonText} from "@ionic/angular/standalone";
import {BaseFieldComponent} from "../base-field/base-field.component";
import {HelpButtonComponent} from "../help-button/help-button.component";
import {ClassifyPipe} from "../../pipes/classify/classify.pipe";

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
    IonItem,
    HelpButtonComponent,
    ClassifyPipe
  ]
})
export class IntegerFieldComponent extends BaseFieldComponent {

}
