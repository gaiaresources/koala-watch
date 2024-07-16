import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {IonInput, IonItem, IonText} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {BaseFieldComponent} from "../base-field/base-field.component";
import {HelpButtonComponent} from "../help-button/help-button.component";
import {ClassifyPipe} from "../../pipes/classify/classify.pipe";

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
    IonItem,
    HelpButtonComponent,
    ClassifyPipe
  ]
})
export class NumberFieldComponent extends BaseFieldComponent {

  doChange() {
    // Required as Safari doesn't trigger value changes otherwise.
  }
}
