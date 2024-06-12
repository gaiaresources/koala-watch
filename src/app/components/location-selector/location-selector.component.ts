import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {DecimalPipe, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {IonButton, IonButtons, IonIcon} from "@ionic/angular/standalone";
import {faLocationArrow, faLocationCrosshairs, faMapPin} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {LocationService} from "../../services/location/location.service";
import {Position} from "@capacitor/geolocation";
import {LocationMapSelectorComponent} from "../location-map-selector/location-map-selector.component";
import {Coordinates} from "../../models/coordinates";
import {ElevationService} from "../../services/elevation/elevation.service";

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
    LocationMapSelectorComponent,
    DecimalPipe,
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

  accuracy: number = -1;

  constructor(
    private locationService: LocationService,
    private elevationService: ElevationService,
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
    this.subscription = this.formGroup.valueChanges.subscribe((values) => {
      this.accuracy = values.Accuracy ?? -1;
    });
  }

  setLocationValues(lat: number, lng: number, accuracy: number, altitude: number) {
    const promise = altitude === -1 ? this.elevationService.getElevation(lat, lng) : Promise.resolve(altitude);

    promise.then((alt) => {
      if (!this.formGroup) return;
      const values: any = {};
      if (this.formGroup.contains("Latitude")) {
        values['Latitude'] = lat.toFixed(6);
      }
      if (this.formGroup.contains('Longitude')) {
        values['Longitude'] = lng.toFixed(6);
      }
      if (this.formGroup.contains('Accuracy')) {
        values['Accuracy'] = Math.round(accuracy ?? -1);
      }
      if (this.formGroup.contains('Altitude')) {
        values['Altitude'] = Math.round(alt);
      }
      this.formGroup.patchValue(values);
    })
  }

  doMapSelect(coords: Coordinates) {
    this.setLocationValues(
      coords.lat,
      coords.lng,
      coords.accuracy,
      coords.altitude,
    )
  }

  doGpsSelect() {
    this.locationService.getPosition().then((position: Position) => {
      const coords = position.coords;
      this.setLocationValues(
        coords.latitude,
        coords.longitude,
        coords.accuracy,
        coords.altitude ?? -1,
      );
    });
  }

}
