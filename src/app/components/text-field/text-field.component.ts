import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {IonInput, IonItem, IonLabel, IonText} from "@ionic/angular/standalone";
import {BaseFieldComponent} from "../base-field/base-field.component";
import {HelpButtonComponent} from "../help-button/help-button.component";
import {ClassifyPipe} from "../../pipes/classify/classify.pipe";

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    IonInput,
    IonLabel,
    IonItem,
    IonText,
    HelpButtonComponent,
    ClassifyPipe,
  ]
})
export class TextFieldComponent extends BaseFieldComponent {
}
