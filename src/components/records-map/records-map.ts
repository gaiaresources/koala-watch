import { GoogleMap, GoogleMaps, LatLng, Marker } from '@ionic-native/google-maps';
import { Component, Input } from '@angular/core/';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { Events, NavParams, Platform } from 'ionic-angular';
import { timer } from 'rxjs/observable/timer';
import { isDatasetCensus } from '../../shared/utils/functions';
import * as moment from 'moment/moment';

@Component({
    selector: 'records-map',
    templateUrl: 'records-map.html'
})
export class RecordsMapComponent {
    @Input()
    public set records(records: ClientRecord[]) {
        this._records = records;
    }

    private map: GoogleMap;
    private _records: ClientRecord[];
    private dragMarker: Marker;

    constructor(private navParams: NavParams,
                private events: Events,
                private platform: Platform) {
    }

    ionViewDidEnter() {
      this.platform.ready().then(() => {
        this.loadMap();
      });
    }

    ionViewDidLeave() {
      if (this.map){
        this.map.remove();

        this.cleanup();
      }
    }

    private cleanup() {
      const nodeList = document.querySelectorAll('._gmaps_cdv_');

      for (let k = 0; k < nodeList.length; ++k) {
          nodeList.item(k).classList.remove('_gmaps_cdv_');
      }
    }


    loadMap(): void {
        this.map = GoogleMaps.create('map');
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
        if (this.navParams.data.hasOwnProperty('data')) {
            this.records = this.navParams.get('data');
        }
        this.events.subscribe('home-willenter', () => this.ionViewWillEnter());
        this.events.subscribe('map-whereispin', () => this.dragMarkerLocation());
    }

    public ionViewWillEnter() {
        timer(500).subscribe(() => this.loadMarkers());
    }

    private dragMarkerLocation() {
      this.events.publish('map-specifiedcoordinates', this.dragMarker.getPosition());
    }

    private loadMarkers() {
        if (this.map) {
            this.map.clear();
            if (this._records && this._records.length) {
                for (const record of this._records) {
                    if (record.hasOwnProperty('data') &&
                        record.data.hasOwnProperty('Latitude') &&
                        record.data.hasOwnProperty('Longitude')) {
                        const title = record.datasetName;
                        const snippet = moment(record.datetime).format('DD/MM/YYYY HH:mm');
                        let url = 'assets/imgs/';
                        url += `${isDatasetCensus(record.datasetName) ? 'tree' : 'eye'}-pin-`;
                        url += `${record.valid ? 'complete' : 'incomplete'}.png`;

                        const marker = this.map.addMarkerSync({
                            snippet: snippet,
                            title: title,
                            icon: {
                                url: url,
                                size: {
                                    width: 45,
                                    height: 45
                                }
                            },
                            animation: 'DROP',
                            position: {
                                lat: record.data.Latitude,
                                lng: record.data.Longitude,
                            }
                        });
                        // FIXME: work out why selector toggles slow to a crawl
                        // marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(
                        //     (value) => {
                        //         const page = record.datasetName.toLowerCase().indexOf('census') > -1 ? 'CensusPage' : 'ObservationPage';
                        //         const params = {
                        //             datasetName: record.datasetName,
                        //             recordClientId: record.client_id,
                        //             parentId: record.parentId
                        //         };
                        //         this.navParams.get('navCtrl').push(page, params);
                        //         return;
                        //     });
                    }
                }
            }
        }
    }
}
