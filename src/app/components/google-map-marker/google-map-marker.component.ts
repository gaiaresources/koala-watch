import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {GoogleMapComponent} from "../google-map/google-map.component";
import {LocationService} from "../../services/location/location.service";
import {Coordinates} from "../../models/coordinates";
import {MarkerCallbackData} from "@capacitor/google-maps/dist/typings/definitions";
import {ElevationService} from "../../services/elevation/elevation.service";
import {BehaviorSubject, combineLatest, concatMap, Observable} from "rxjs";
import {GoogleMap} from "@capacitor/google-maps";
import {AsyncPipe, NgIf} from "@angular/common";
import {AlertController} from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-google-map-marker',
  templateUrl: './google-map-marker.component.html',
  styleUrls: ['./google-map-marker.component.scss'],
  imports: [
    NgIf,
    AsyncPipe
  ]
})
export class GoogleMapMarkerComponent implements OnInit, OnChanges {

  @Input()
  draggable: boolean = false;

  @Input()
  lat?: number;

  @Input()
  lng?: number;

  @Input()
  title?: string;

  @Input()
  snippet?: string;

  @Input()
  iconUrl?: string;

  @Input()
  iconSize?: { width: number, height: number };

  @Input()
  iconOrigin?: { x: number, y: number };

  @Input()
  iconAnchor?: { x: number, y: number };

  @Output()
  onChanged = new EventEmitter<Coordinates>();

  private _options = new BehaviorSubject<any>(null);
  private _marker: string = "";
  public marker$: Observable<string>;

  constructor(
    private readonly mapComponent: GoogleMapComponent,
    private locationService: LocationService,
    private elevationService: ElevationService,
    private alertController: AlertController,
  ) {
    this.marker$ = combineLatest([
      this.mapComponent.map,
      this._options.asObservable(),
    ]).pipe(
      concatMap(async ([map, options]) => {
        if (!map || !options) return "";
        return this.setMarker(map as GoogleMap, options);
      }),
    );
  }

  ngOnInit() {
    this.setListeners();
  }

  ngOnChanges(changes: SimpleChanges) {
    const options: any = {
      lat: this.lat,
      lng: this.lng,
    };
    this.getOptionalConfig().forEach(key => {
      if (this.hasOwnProperty(key)) {
        options[key] = (this as any)[key]
      }
    });
    this._options.next(options);
  }

  async setListeners() {
    const events = this.mapComponent.events;
    const self = this;
    events.on<MarkerCallbackData>('MarkerDragEnd', function (e) {
      if (e.markerId !== self._marker) return;
      self.doDragEnd(e);
    });
    events.on<MarkerCallbackData>('MarkerClick', function(e) {
      if (e.markerId !== self._marker) return;
      if (self.title && self.snippet) {
        self.alertController.create({
          header: self.title,
          message: self.snippet,
          buttons: ['OK'],
        }).then(alert => alert.present());
      }
    });
  }

  async setMarker(map: GoogleMap, options: any) {
    const marker = this._marker;
    if (marker) {
      await map.removeMarker(marker);
    }

    const current = await this.locationService.getPosition();
    const lat = options.lat ?? current.coords.latitude;
    const lng = options.lng ?? current.coords.longitude;
    const config: any = {
      coordinate: { lat, lng },
    };
    this.getOptionalConfig().forEach(key => {
      if (options.hasOwnProperty(key)) {
        config[key] = options[key];
      }
    });

    this.onChanged.next({
      accuracy: 0,
      altitude: 0,
      lat,
      lng,
    });
    return map.addMarker(config).then(marker => this._marker = marker);
  }

  private getOptionalConfig() {
    return [
      'draggable',
      'iconSize',
      'iconUrl',
      'iconAnchor',
      'iconOrigin',
      'title',
      'snippet',
    ];
  }

  private doDragEnd(marker: MarkerCallbackData) {
    const lat = marker.latitude;
    const lng = marker.longitude;
    this.onChanged.emit({
      accuracy: 0,
      altitude: 0,
      lat,
      lng,
    });

    // Allow elevation to be handled if supported.
    this.elevationService.getElevation(lat, lng).then((value) => {
      if (!value) return;
      this.onChanged.emit({
        accuracy: 0,
        altitude: value,
        lat,
        lng,
      });
    });
  }

}
