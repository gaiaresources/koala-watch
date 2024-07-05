import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {Coordinates} from "../../models/coordinates";
import {GoogleMap, MapAdvancedMarker, MapMarker} from "@angular/google-maps";
import {LocationService} from "../../services/location/location.service";
import {DOCUMENT, NgIf} from "@angular/common";
import {ElevationService} from "../../services/elevation/elevation.service";

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
    MapMarker,
    NgIf,
    MapAdvancedMarker
  ]
})
export class LocationMapSelectorComponent implements OnInit, OnChanges {

  @ViewChild(IonModal) modal?: IonModal;

  @Input()
  lat?: number;

  @Input()
  lng?: number;

  coords?: Coordinates;
  current?: Coordinates;
  currentIcon: google.maps.Symbol | string = "";

  @Output()
  onSelect = new EventEmitter<Coordinates>();

  constructor(
    private locationService: LocationService,
    private elevationService: ElevationService,
  ) {
  }

  ngOnInit() {
    this.locationService.getPosition().then((location) => {
      this.current = location;
      if (!this.lat || !this.lng) {
        this.coords = {...location};
      }
    });

    this.currentIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      fillOpacity: 1,
      strokeWeight: 1,
      fillColor: '#5384ED',
      strokeColor: '#ffffff',
    };
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
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      this.elevationService.getElevation(lat, lng).then((altitude) => {
        this.coords = {
          lat, lng, altitude, accuracy: 0,
        };
      }, (error) => {
        this.coords = {
          lat, lng, altitude: "", accuracy: "",
        };
      });
    }
  }

}
