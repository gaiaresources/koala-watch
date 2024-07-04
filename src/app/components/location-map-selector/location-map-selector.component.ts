import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {Coordinates} from "../../models/coordinates";
import {GoogleMap, MapMarker} from "@angular/google-maps";
import {LocationService} from "../../services/location/location.service";

@Component({
  standalone: true,
  selector: 'app-location-map-selector',
  templateUrl: './location-map-selector.component.html',
  styleUrls: ['./location-map-selector.component.scss'],
  imports: [
    IonContent,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    GoogleMap,
    MapMarker
  ]
})
export class LocationMapSelectorComponent implements OnInit, OnChanges {

  @ViewChild(IonModal) modal?: IonModal;

  @Input()
  lat?: number;

  @Input()
  lng?: number;

  coords: Coordinates = {lat: 0, lng: 0, altitude: "", accuracy: ""};

  @Output()
  onSelect = new EventEmitter<Coordinates>();

  constructor(
    private locationService: LocationService,
  ) {
  }

  ngOnInit() {
    if (!this.lat || !this.lng) {
      this.locationService.getPosition().then((coords) => {
        this.lat = coords.coords.latitude;
        this.lng = coords.coords.longitude;
        this.coords = {
          lat: this.lat,
          lng: this.lng,
          altitude: "",
          accuracy: "",
        };
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['lat'] || changes['lng']) {
      this.coords = {
        lat: this.lat || 0,
        lng: this.lng || 0,
        altitude: "",
        accuracy: "",
      };
    }
  }

  onCancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  onConfirm() {
    this.modal?.dismiss(null, 'confirm');
    this.onSelect.emit(this.coords);
  }

  doUpdatePosition(e: google.maps.MapMouseEvent) {
    if (e.latLng) {
      this.coords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        altitude: "",
        accuracy: "",
      };
    }
  }

}
