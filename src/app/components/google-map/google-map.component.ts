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
import {GoogleMap} from "@capacitor/google-maps";
import {LocationService} from "../../services/location/location.service";
import {GoogleMapEvents} from "./google-map-events";

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

  @ViewChild('map', {static: false})
  set mapRef(ref: ElementRef) {
    setTimeout(() => {
      this.createMap(ref.nativeElement);
    }, 500);
  }

  events = new GoogleMapEvents(inject(NgZone));
  map: Promise<GoogleMap>;

  private resolve: any;

  constructor(
    @Inject(GOOGLE_MAP_API) private googleMapApi: string,
    private locationService: LocationService,
  ) {
    this.map = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.map.then((map) => {
      map.destroy();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['camera'] || changes['zoom']) {
      this.setCamera();
    }
  }

  async setCamera() {
    this.map.then(async (map) => {
      const bounds = await map.getMapBounds();
      const coordinate = {
        lat: this.lat ?? bounds.center.lat,
        lng: this.lng ?? bounds.center.lng,
      };
      await map.setCamera({
        coordinate: coordinate,
        zoom: this.zoom,
      });
    });
  }

  /*
  async updateSelectPosition() {
    if (!this.map) return;

    // There is no select position behaviour so remove any existing markers.
    if (!this.selectPosition) {
      await this.map.enableCurrentLocation(false);
      if (this.position) {
        await this.map.removeMarker(this.position);
        this.position = "";
      }
      return;
    }

    if (!this.position) {
      const position = await this.locationService.getPosition();
      const coordinate = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        altitude: -1,
        accuracy: 0,
      };
      this.position = await this.map.addMarker({coordinate, draggable: true});
      await this.map.enableCurrentLocation(true);
      await this.map.setCamera({coordinate, zoom: 16});
      this.onPosition.emit(coordinate);
    }
  }
  */

  async createMap(ref: HTMLElement) {
    const current = await this.locationService.getPosition();
    const map = await GoogleMap.create({
      id: this.id,
      element: ref,
      apiKey: this.googleMapApi,
      config: {
        center: {
          lat: this.lat ?? current.coords.latitude,
          lng: this.lng ?? current.coords.longitude,
        },
        zoom: this.zoom,
      },
    });
    this.resolve(map);
    this.events.setMap(map);
  }

}
