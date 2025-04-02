import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {IonButton, IonButtons, IonContent, IonModal} from "@ionic/angular/standalone";
import {Coordinates} from "../../models/coordinates";
import {GoogleMap, MapAdvancedMarker, MapMarker} from "@angular/google-maps";
import {LocationService} from "../../services/location/location.service";
import {NgIf} from "@angular/common";
import {ElevationService} from "../../services/elevation/elevation.service";
import {Subscription} from "rxjs";
import {HeaderToolbarComponent} from '../header-toolbar/header-toolbar.component';

@Component({
  standalone: true,
  selector: 'app-location-map-selector',
  templateUrl: './location-map-selector.component.html',
  styleUrls: ['./location-map-selector.component.scss'],
  imports: [
    IonContent,
    IonModal,
    IonButtons,
    IonButton,
    GoogleMap,
    MapMarker,
    NgIf,
    MapAdvancedMarker,
    HeaderToolbarComponent
  ]
})
export class LocationMapSelectorComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild(IonModal) modal?: IonModal;

  @Input()
  lat?: number;

  @Input()
  lng?: number;

  @Input({required: true})
  toggleId!: string;

  coords?: Coordinates;
  current?: Coordinates;
  currentIcon: google.maps.Symbol | string = "";

  @Output()
  onSelect = new EventEmitter<Coordinates>();

  subscription: Subscription[] = [];

  constructor(
    private locationService: LocationService,
    private elevationService: ElevationService,
  ) {
  }

  ngOnInit() {
    this.subscription.push(
      this.locationService.watchPosition().subscribe((location) => {
        this.current = location;
      })
    );

    this.currentIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      fillOpacity: 1,
      strokeWeight: 1,
      fillColor: '#5384ed',
      strokeColor: '#fff',
    };
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => sub.unsubscribe());
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
