import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {DecimalPipe, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {IonButton, IonButtons, IonIcon} from "@ionic/angular/standalone";
import {faLocationArrow, faLocationCrosshairs, faMapPin} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {LocationService} from "../../services/location/location.service";
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
export class LocationSelectorComponent implements OnInit, OnDestroy, OnChanges {

  public faLocationArrow = faLocationArrow;
  public faMapPin = faMapPin;
  public faLocationCrosshairs = faLocationCrosshairs;

  @Input()
  readonly: boolean = false;

  @Input({required: true})
  formGroup?: FormGroup;

  @Input({required: true})
  id!: string;

  subscription: Subscription[] = [];

  accuracy: number | "" = "";

  lat?: number;
  lng?: number;

  constructor(
    private locationService: LocationService,
    private elevationService: ElevationService,
  ) {
  }

  ngOnInit() {
    this.subscription.push(
      this.locationService.watchPosition().subscribe((location) => {
        if (!this.lat || !this.lng) {
          this.lat = location.lat;
          this.lng = location.lng;
          this.setLocationValues(location.lat, location.lng, location.accuracy, location.altitude);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formGroup']) {
      this.setup();
    }
  }

  setup() {
    // There is an existing subscription to the formGroup.
    if (this.subscription.length > 0) {
      this.subscription.forEach(sub => sub.unsubscribe());
      this.subscription = [];
    }

    // No form group so ignore setup.
    if (!this.formGroup) return;

    // Process form value changes internally.
    this.subscription.push(
      this.formGroup.valueChanges.subscribe((values) => {
        this.accuracy = values.Accuracy ?? "";
      })
    );

    if (this.formGroup.contains("Latitude")) {
      const value = this.formGroup.get('Latitude')?.value;
      this.lat = value ? parseFloat(value) : undefined;
    }
    if (this.formGroup.contains('Longitude')) {
      const value = this.formGroup.get('Longitude')?.value;
      this.lng = value ? parseFloat(value) : undefined;
    }
  }

  setLocationValues(lat: number, lng: number, accuracy: number | "", altitude: number | "") {
    const promise = altitude === "" ? this.elevationService.getElevation(lat, lng) : Promise.resolve(altitude);

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
        values['Accuracy'] = accuracy ? Math.round(accuracy) : "";
      }
      if (this.formGroup.contains('Altitude')) {
        values['Altitude'] = alt ? Math.round(alt) : "";
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
    this.subscription.push(
      this.locationService.getLocation((location) => {
        this.setLocationValues(
          location.lat,
          location.lng,
          location.accuracy,
          location.altitude ?? "",
        );
      }),
    );
  }

}
