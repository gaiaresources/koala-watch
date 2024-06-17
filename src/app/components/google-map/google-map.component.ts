import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Platform} from "@ionic/angular/standalone";
import {GOOGLE_MAP_API} from "../../tokens/gmap";
import {NgIf} from "@angular/common";
import {GoogleMap} from "@capacitor/google-maps";
import {LocationService} from "../../services/location/location.service";
import {Coordinates} from "../../models/coordinates";

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
export class GoogleMapComponent implements OnInit {

  @Input()
  id: string = 'google-map';

  @Input()
  selectPosition: boolean = true;

  @ViewChild('map', {static: false})
  mapRef?: ElementRef<HTMLElement>;
  newMap?: GoogleMap;

  position: string = "";
  @Output()
  onPosition = new EventEmitter<Coordinates>();

  constructor(
    @Inject(GOOGLE_MAP_API) private googleMapApi: string,
    private platform: Platform,
    private locationService: LocationService,
  ) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  ionViewDidEnter() {
  }

  async updateSelectPosition() {
    if (!this.newMap) return;

    // There is no select position behaviour so remove any existing markers.
    if (!this.selectPosition) {
      await this.newMap.enableCurrentLocation(false);
      if (this.position) {
        await this.newMap.removeMarker(this.position);
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
      this.position = await this.newMap.addMarker({coordinate, draggable: true});
      await this.newMap.enableCurrentLocation(true);
      await this.newMap.setCamera({coordinate, zoom: 16});
      this.onPosition.emit(coordinate);
    }
  }

  async loadMap() {
    if (this.mapRef) {
      const map = await GoogleMap.create({
        id: this.id,
        element: this.mapRef.nativeElement,
        apiKey: this.googleMapApi,
        config: {
          center: {
            lat: 33.6,
            lng: -117.9,
          },
          zoom: 3.5,
        },
      });
      this.newMap = map;

      map.setOnMarkerDragEndListener((marker) => {
        if (this.selectPosition && this.position) {
          const coordinate = {
            lat: marker.latitude,
            lng: marker.longitude,
            altitude: -1,
            accuracy: 0,
          };
          this.onPosition.emit(coordinate);
        }
      });

      await this.updateSelectPosition();
    }
  }

}
