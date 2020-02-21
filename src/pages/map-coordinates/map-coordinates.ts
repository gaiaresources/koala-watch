import { Component} from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { GoogleMap, GoogleMaps, ILatLng, LatLng, Marker, GoogleMapOptions } from '@ionic-native/google-maps';
import { timer } from '../../../node_modules/rxjs/observable/timer';

/**
 * Generated class for the MapCoordinatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'mcp',
  segment: 'mcp'
})
@Component({
  selector: 'page-map-coordinates',
  templateUrl: 'map-coordinates.html',
})
export class MapCoordinatesPage {
  private map: GoogleMap;
  private dragMarker: Marker;
  private startPos: ILatLng;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private events: Events) {
    this.startPos = this.navParams.data;
    return;
  }

  ionViewDidLoad() {
    setTimeout( () => {
      this.loadMap();
    }, 2000);

  }


  loadMap(): void {
    this.map = GoogleMaps.create('map-getpin');
    this.map.setOptions({
      'backgroundColor': 'white',
      'building': false,
      'mapType': 'MAP_TYPE_HYBRID',
      'controls': {
        'compass': false,
        'zoom': false,
        'indoorPicker': false,
      },
      'gestures': {
        'scroll': true,
        'zoom': true,
        'tilt': false,
        'rotate': false,
      },
      'camera': {
        'target': new LatLng(-25, 132),
        'zoom': 3.5,
      }
    });
    this.map.setMyLocationEnabled(true);
    this.map.setMyLocationButtonEnabled(true);
    this.events.subscribe('home-willenter', () => {});
    this.events.subscribe('map-whereispin', () => {});
    timer(100).subscribe(() => {
      let position: LatLng = new LatLng(this.startPos.lat, this.startPos.lng);
      if (!(Math.abs(position.lat) > 0.1 && Math.abs(position.lng) > 0.1)) {
        position = new LatLng(-33.0, 146.012);
      }
      const options = {
        snippet: 'Move this pin to the koala sighting location',
        title: 'Move this pin to the koala sighting location',
        position: position,
        draggable: true
      };
      this.dragMarker = this.map.addMarkerSync(options);
    });
  }

  useClicked() {
    this.events.publish('map-returnCoordinates', this.dragMarker.getPosition());
    this.navCtrl.pop();
    return;
  }
}
