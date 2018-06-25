import { GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng, } from '@ionic-native/google-maps';
import { Component, Input, OnInit } from '@angular/core/';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { Events, NavParams } from "ionic-angular";

@Component({
    selector: 'records-map',
    templateUrl: 'records-map.html'
})
export class RecordsMapComponent implements OnInit {
    @Input()
    public set records(records: ClientRecord[]) {
        this._records = records;
    }

    private map: GoogleMap;
    private _records: ClientRecord[];

    constructor(private navParams: NavParams) {
    }

    ngOnInit(): void {
        this.map = GoogleMaps.create('map');
        this.map.setOptions({
            'backgroundColor': 'white',
            'building': false,
            'mapType': 'MAP_TYPE_HYBRID',
            'controls': {
                'compass': false,
                'zoom': false,
                'indoorPicker': false,
                'myLocationButton': true,
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
        if (this.navParams.data.hasOwnProperty('data')) {
            this.records = this.navParams.get('data');
        }
    }

    public ionViewWillEnter() {
        this.loadMarkers();
    }

    private loadMarkers() {
        if (this.map) {
            this.map.clear();
            if (this._records && this._records.length) {
                for (const record of this._records) {
                    if (record.hasOwnProperty('data') &&
                        record.data.hasOwnProperty('Latitude') &&
                        record.data.hasOwnProperty('Longitude')) {
                        let title = record.data['Site ID'];
                        if (record.data['First Date']) {
                            title += ` ${record.data['First Date']}`;
                        }
                        const snippet = record.client_id || '';
                        const marker = this.map.addMarkerSync({
                            snippet: snippet,
                            title: title,
                            icon: record.valid ? '#ebffef' : '#ebf6ff',
                            animation: 'DROP',
                            position: {
                                lat: record.data.Latitude,
                                lng: record.data.Longitude,
                            }
                        });
                        marker.on(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
                            const page = record.datasetName.toLowerCase().indexOf('census') > -1 ? 'CensusPage' : 'ObservationPage';
                            const params = {
                                datasetName: record.datasetName,
                                recordClientId: record.client_id,
                                parentId: record.parentId
                            };
                            this.navParams.get('navCtrl').push(page, params);
                            return;
                        });
                    }
                }
            }
        }
    }
}
