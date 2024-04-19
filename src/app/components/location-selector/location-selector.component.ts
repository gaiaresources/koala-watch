import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { NgIf } from "@angular/common";
import { Subscription } from "rxjs";
import { IonicModule } from "@ionic/angular";
import { IonButton, IonButtons, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    IonButtons,
    IonButton,
    IonIcon,
  ]
})
export class LocationSelectorComponent implements OnInit, OnChanges {

  @Input()
  readonly: boolean = false;

  @Input({required: true})
  formGroup?: FormGroup;

  subscription?: Subscription;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formGroup']) {
      this.setup();
    }
  }

  setup() {
    // There is an existing subscription to the formGroup.
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }

    // No form group so ignore setup.
    if (!this.formGroup) return;

    // Process form value changes internally.
    this.subscription = this.formGroup?.valueChanges.subscribe((values) => {
      // TODO: This should update the accuracy display
      console.log(values);
    });
  }

  doMapSelect() {
    // TODO: Perform a selection via the map.
  }

  doGpsSelect() {
    // TODO: Perform selection via the GPS.
  }

  updateForm() {
    // TODO: This updates the various values for the "location".
  }

}
