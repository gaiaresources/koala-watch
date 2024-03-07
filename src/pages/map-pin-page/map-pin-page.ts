import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from '@ionic/angular';
//import { NavController, NavParams, Platform, Events } from '@ionic/angular';
//import { GoogleMap, GoogleMaps, ILatLng, LatLng, GoogleMapOptions, GoogleMapsEvent } from '@capacitor/google-maps';
import { Marker, GoogleMap, LatLngBounds } from '@capacitor/google-maps'

import { FormNavigationRecord, ActiveRecordService } from '../../providers/activerecordservice/active-record.service';
import {LatLng} from "@capacitor/google-maps/dist/typings/definitions";


/**
 * Generated class for the MapPinModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'map-pin-page',
  templateUrl: 'map-pin-page.html',
})
export class MapPinPage {
  private map?: GoogleMap;
  private dragMarker!: Marker;
  private startPos: LatLng;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    //private events: Events,
    private platform: Platform,
    public activeRecordService: ActiveRecordService) {
    this.startPos = this.navParams.data as LatLng;
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap(): void {
    /*
    //this.map = GoogleMap.create({

    //}).create('map-getpin');

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
    this.map.enableCurrentLocation(true)
    //this.map.setMyLocationEnabled(true);
    //this.map.setMyLocationButtonEnabled(true);
    //this.events.subscribe('home-willenter', () => { });
    //this.events.subscribe('map-whereispin', () => { });
    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
          (data: any[]) => {
            if (!this.dragMarker) {
              this.dragMarker = this.map.addMarkerSync({
                snippet: 'Move this pin to the koala sighting location',
                title: 'Move this pin to the koala sighting location',
                position: data[0],
                draggable: true
              });
            } else {
              this.dragMarker.coordinate = data[0];
            }
          }
        );
      });

     */
  }

  ionViewWillLeave() {
    this.activeRecordService.comingFromMap = true;
    if (this.map){
      this.map.destroy();

      this.cleanup();
    }
  }

  useClicked() {
    this.activeRecordService.setLatestCoords(this.dragMarker.coordinate);
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
    this.activeRecordService.comingFromMap = true;
      this.navCtrl.pop();
  }

}
