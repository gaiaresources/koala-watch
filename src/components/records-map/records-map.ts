import { GoogleMap, GoogleMapOptions, GoogleMaps, LatLng } from '@ionic-native/google-maps';
import { Component } from '@angular/core/';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { OnInit, Input } from '@angular/core';

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
        if (!this.map) {
            this.loadMap();
        }
    }

    private loadMap() {
        let location = new LatLng(-25, 132);
        let mapOptions: GoogleMapOptions = {
            'backgroundColor': 'white',
            'controls': {
                'compass': false,
                'zoom': false
            },
            'gestures': {
                'scroll': true,
                'zoom': true
            },
            'camera': {
                'target': location,
                'zoom': 3.5,
            }
        };

        this.map = GoogleMaps.create('map', mapOptions);

        if (this._records) {
            this.loadMarkers();
        }
    }

    private loadMarkers() {
        this.map.clear();

        for (let record of this._records) {
            if (record.hasOwnProperty('data') && record.data.hasOwnProperty('Latitude') &&
                    record.data.hasOwnProperty('Longitude')) {
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
