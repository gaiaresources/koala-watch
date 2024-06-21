import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {GOOGLE_MAP_API} from "../../tokens/gmap";
import {NgIf} from "@angular/common";
import {LocationService} from "../../services/location/location.service";
import {GoogleMapEvents} from "./google-map-events";
import {BehaviorSubject} from "rxjs";
import {GoogleMap} from "@angular/google-maps";

@Component({
  standalone: true,
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  imports: [
    NgIf,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GoogleMapComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  id: string = 'google-map';

  @Input()
  lat?: number;

  @Input()
  lng?: number;

  @Input()
  zoom: number = 8;

  @Input()
  options: google.maps.MapOptions = {};

  @ViewChild('map', {static: false})
  set mapRef(ref: ElementRef) {
    this.createMap(ref.nativeElement);
  }

  events = new GoogleMapEvents(inject(NgZone));
  private _map = new BehaviorSubject<GoogleMap | null>(null);
  public map = this._map.asObservable()

  constructor(
    @Inject(GOOGLE_MAP_API) private googleMapApi: string,
    private locationService: LocationService,
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['camera'] || changes['zoom']) {
      this.setCamera();
    }
  }

  private hasMap() {
    return this._map.value !== null;
  }

  private getMap() {
    return this._map.value;
  }

  private destroy() {
    const map = this.getMap();
    if (map) {
      // map.destroy();
    }
  }

  async setCamera() {
    const map = this.getMap();
    if (!map) return;

    /*
    const bounds = await map.getMapBounds();
    const coordinate = {
      lat: this.lat ?? bounds.center.lat,
      lng: this.lng ?? bounds.center.lng,
    };
    await map.setCamera({
      coordinate: coordinate,
      zoom: this.zoom,
    });
     */
  }

  async createMap(ref: HTMLElement) {
    /*
    const current = await this.locationService.getPosition();
    if (this.hasMap()) {
      this.destroy();
    }

    const map = await GoogleMap.create({
      id: this.id,
      element: ref,
      apiKey: this.googleMapApi,
      config: {
        ...(this.options || {}),
        center: {
          lat: this.lat ?? current.coords.latitude,
          lng: this.lng ?? current.coords.longitude,
        },
        zoom: this.zoom,
      } as GoogleMapConfig,
    });
    this.events.setMap(map);
    this._map.next(map);
     */
  }

}
