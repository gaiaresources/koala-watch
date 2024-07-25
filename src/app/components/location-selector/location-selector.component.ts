import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {DecimalPipe, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {AlertController, IonButton, IonButtons, IonIcon} from "@ionic/angular/standalone";
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
export class LocationSelectorComponent implements OnInit, OnChanges {

  public faLocationArrow = faLocationArrow;
  public faMapPin = faMapPin;
  public faLocationCrosshairs = faLocationCrosshairs;

  @Input()
  readonly: boolean = false;

  @Input({required: true})
  formGroup?: FormGroup;

  subscription?: Subscription;

  accuracy: number | "" = "";

  lat?: number;
  lng?: number;

  constructor(
    private locationService: LocationService,
    private elevationService: ElevationService,
    private alertController: AlertController,
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
      this.accuracy = values.Accuracy ?? "";
    });

    if (this.formGroup.contains("Latitude")) {
      const value = this.formGroup.get('Latitude')?.value;
      this.lat = value ? parseFloat(value) : undefined;
    }
    if (this.formGroup.contains('Longitude')) {
      const value = this.formGroup.get('Longitude')?.value;
      this.lng = value ? parseFloat(value) : undefined;
    }

    if (!this.lat || !this.lng) {
      this.locationService.getPosition().then((coords) => {
        this.lat = coords.lat;
        this.lng = coords.lng;
        this.setLocationValues(coords.lat, coords.lng, coords.accuracy, coords.altitude);
      });
    }
  }

  async showUnavailable() {
    const alert = await this.alertController.create({
      message: 'Location unavailable',
    });
    await alert.present();
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
    this.locationService.getPosition().then((coords: Coordinates) => {
      this.setLocationValues(
        coords.lat,
        coords.lng,
        coords.accuracy,
        coords.altitude ?? "",
      );
    }, async (_e) => {
      await this.showUnavailable();
    });
  }

}
