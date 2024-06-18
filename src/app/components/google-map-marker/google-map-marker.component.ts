import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GoogleMapComponent} from "../google-map/google-map.component";
import {LocationService} from "../../services/location/location.service";
import {Coordinates} from "../../models/coordinates";
import {MarkerCallbackData} from "@capacitor/google-maps/dist/typings/definitions";
import {ElevationService} from "../../services/elevation/elevation.service";

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

  private _marker: string = "";

  constructor(
    private readonly mapComponent: GoogleMapComponent,
    private locationService: LocationService,
    private elevationService: ElevationService,
  ) {
    this._marker = "";
  }

  ngOnInit() {
    if (!this.mapComponent.map) {
      throw new Error('Google map missing in action.');
    }
    this.setListeners();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setMarker();
  }

  getMap() {
    return this.mapComponent.map;
  }

  async setListeners() {
    const events = this.mapComponent.events;
    const self = this;
    events.on<MarkerCallbackData>('MarkerDragEnd', function (e) {
      if (e.markerId !== self._marker) return;
      const lat = e.latitude;
      const lng = e.longitude;
      self.onChanged.emit({
        accuracy: 0,
        altitude: 0,
        lat,
        lng,
      });
    });
  }

  async setMarker() {
    const map = await this.getMap();
    const marker = this._marker;
    if (marker) {
      await map.removeMarker(marker);
    }

    const current = await this.locationService.getPosition();

    map.addMarker({
      coordinate: {
        lat: this.lat ?? current.coords.latitude,
        lng: this.lng ?? current.coords.longitude,
      },
      draggable: this.draggable,
    }).then(marker => this._marker = marker);
  }

}
