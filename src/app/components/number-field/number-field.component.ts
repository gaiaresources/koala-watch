import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {IonInput, IonText} from "@ionic/angular/standalone";
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
    ClassifyPipe,
    HelpButtonComponent
  ]
})
export class NumberFieldComponent extends BaseFieldComponent {

  doChange() {
    //Blank out location accuracy if a user enters their own measurement
    if(this.formGroup?.get('Accuracy')?.pristine) {
      this.formGroup?.get('Accuracy')?.setValue("")
    }
  }
}
