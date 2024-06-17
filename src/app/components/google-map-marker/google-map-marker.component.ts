import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GoogleMapComponent} from "../google-map/google-map.component";
import {LocationService} from "../../services/location/location.service";
import {Coordinates} from "../../models/coordinates";
import {MapClickCallbackData, MapListenerCallback} from "@capacitor/google-maps/dist/typings/definitions";

@Component({
  standalone: true,
  selector: 'app-google-map-marker',
  templateUrl: './google-map-marker.component.html',
  styleUrls: ['./google-map-marker.component.scss'],
})
export class GoogleMapMarkerComponent implements OnInit, OnChanges {

  @Input()
  draggable: boolean = false;

  @Input()
  lat?: number;

  @Input()
  lng?: number;

  @Output()
  onChanged = new EventEmitter<Coordinates>();

  private marker: Promise<string>;

  private dragListener: any;

  constructor(
    private readonly mapComponent: GoogleMapComponent,
    private locationService: LocationService,
  ) {
    this.marker = Promise.resolve("");
  }

  ngOnInit() {
    if (!this.mapComponent.map) {
      throw new Error('Google map missing in action.');
    }
    this.setListeners();
    this.setMarker();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setMarker();
  }

  getMap() {
    return this.mapComponent.map;
  }

  async setListeners() {
    const events = this.mapComponent.events;
  }

  async setMarker() {
    const map = await this.getMap();
    const marker = await this.marker;
    if (marker) {
      await map.removeMarker(marker);
    }

    let coords: any;
    if (this.lat === undefined || this.lng === undefined) {
      const current = await this.locationService.getPosition();
      coords = current.coords;
    }

    this.marker = map.addMarker({
      coordinate: {
        lat: this.lat ?? coords.latitude,
        lng: this.lng ?? coords.longitude,
      },
      draggable: this.draggable,
    }).then((marker) => {
      console.log('id', marker, this.lat, this.lng, coords);
      return marker;
    });
  }

}
