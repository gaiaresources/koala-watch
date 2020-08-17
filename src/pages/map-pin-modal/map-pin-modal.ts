import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, Events } from 'ionic-angular';
import { GoogleMap, GoogleMaps, ILatLng, LatLng, Marker, GoogleMapOptions, GoogleMapsEvent } from '@ionic-native/google-maps';
import { timer } from 'rxjs/observable/timer';

/**
 * Generated class for the MapPinModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'map-pin-modal.html',
})
export class MapPinModalPage {
  private map: GoogleMap;
  private dragMarker: Marker;
  private startPos: ILatLng;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private events: Events,
    private platform: Platform) {
      this.startPos = this.navParams.data;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
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
    this.events.subscribe('home-willenter', () => { });
    this.events.subscribe('map-whereispin', () => { });
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
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

        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
            (data) => {
              this.map.clear();
              this.dragMarker = this.map.addMarkerSync({
                snippet: 'Move this pin to the koala sighting location',
                title: 'Move this pin to the koala sighting location',
                position: data[0],
                draggable: true
              });
            }
        );
      });
  }

  useClicked() {
    this.events.publish('map-returnCoordinates', this.dragMarker.getPosition());

    this.closeModal();
  }

  // hack required to remove maps background
  private cleanup() {
    const nodeList = document.querySelectorAll('._gmaps_cdv_');

    for (let k = 0; k < nodeList.length; ++k) {
        nodeList.item(k).classList.remove('_gmaps_cdv_');
    }
  }

  public closeModal() {
    this.cleanup();
    this.viewCtrl.dismiss();
  }

}
