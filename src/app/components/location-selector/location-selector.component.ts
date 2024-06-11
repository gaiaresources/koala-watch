import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {IonButton, IonButtons, IonIcon} from "@ionic/angular/standalone";
import {faLocationArrow, faLocationCrosshairs, faMapPin} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {LocationService} from "../../services/location/location.service";
import {Position} from "@capacitor/geolocation";

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
    FaIconComponent,
  ]
})
export class LocationSelectorComponent implements OnInit, OnChanges {

  public faLocationArrow = faLocationArrow;
  public faMapPin = faMapPin;
  public faLocationCrosshairs = faLocationCrosshairs;

  @Input()
  readonly: boolean = false;

  @Input({required: true})
  formGroup?: FormGroup;

  subscription?: Subscription;

  constructor(
    private locationService: LocationService,
  ) {
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
    this.locationService.getPosition().then((position: Position) => {
      if (!this.formGroup) return;
      const values: any = {};
      if (this.formGroup.contains("Latitude")) {
        values['Latitude'] = position.coords.latitude.toFixed(6);
      }
      if (this.formGroup.contains('Longitude')) {
        values['Longitude'] = position.coords.longitude.toFixed(6);
      }
      if (this.formGroup.contains('Accuracy')) {
        values['Accuracy'] = Math.round(position.coords.accuracy ?? -1);
      }
      if (this.formGroup.contains('Altitude')) {
        values['Altitude'] = Math.round(position.coords.altitude ?? -1);
      }

      this.formGroup.patchValue(values);
    });
  }

  updateForm() {
    // TODO: This updates the various values for the "location".
  }

}
