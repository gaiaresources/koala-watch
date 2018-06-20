import { GoogleMap, GoogleMaps, LatLng, } from '@ionic-native/google-maps';
import { Component, Input, OnInit } from '@angular/core/';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';

@Component({
    selector: 'records-map',
    templateUrl: 'records-map.html'
})
export class RecordsMapComponent implements OnInit {
    @Input()
    public set records(records: ClientRecord[]) {
        this._records = records;
        if (this.map) {
            this.loadMarkers();
        }
    }

    private map: GoogleMap;
    private _records: ClientRecord[];

    constructor() {
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
        this.loadMarkers();
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
                        console.log(record.data);
                        alert(record.data.toString());
                        this.map.addMarkerSync({
                            title: record.data['First Date'],
                            icon: record.valid ? 'green' : 'blue',
                            animation: 'DROP',
                            position: {
                                lat: record.data.Latitude,
                                lng: record.data.Longitude,
                            }
                        });
                    }
                }
            }
        }
    }
}
