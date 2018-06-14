import { GoogleMap, GoogleMapOptions, GoogleMaps, LatLng, } from '@ionic-native/google-maps';
import { Component, Input, OnInit } from '@angular/core/';
import { ClientRecord } from "../../shared/interfaces/mobile.interfaces";
import { l } from "@angular/core/src/render3";

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
        this.map = GoogleMaps.create('map', {
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
                'target': new LatLng(-25, 132),
                'zoom': 3.5,
            }
        });
        if (!this.map) {
            this.loadMarkers();
        }
    }
    
    public ionViewWillEnter() {
        //this.loadMarkers();
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
