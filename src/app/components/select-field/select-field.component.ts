import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {BaseFieldComponent} from "../base-field/base-field.component";
import {IonItem, IonLabel, IonSelect, IonSelectOption, IonText} from "@ionic/angular/standalone";
import {NgForOf, NgIf} from "@angular/common";

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
