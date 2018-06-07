import {
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsEvent,
    LatLng, Marker,
} from '@ionic-native/google-maps';
import { Component, Input, OnInit, ViewChild } from '@angular/core/';
import { IonicPage, NavParams, Platform } from "ionic-angular";
import { InputDecorator } from "@angular/core/src/metadata/directives";
import { ClientRecord } from "../../shared/interfaces/mobile.interfaces";

@Component({
    selector: 'records-map',
    templateUrl: 'records-map.html'
})
export class RecordsMapComponent implements OnInit {
    private map: any;
    
    @Input()
    public records: ClientRecord[];

    constructor(navParams: NavParams) {
        if (navParams.data !== undefined && navParams.data.hasOwnProperty('data'))
            this.records = navParams.data.data;
    }
    
    private ionViewDidLoad() {
        this.loadMap();
    }

    private loadMap() {
        // alert('here');
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
 
        for (let item of this.records) {
            // alert(item.geometry.coordinates[0]);
            try {
                let marker: Marker = this.map.addMarkerSync({
                    title: item.datetime,
                    icon: item.valid ? 'green' : 'red',
                    animation: 'DROP',
                    position: {
                        // FIXME: stop assuming the geojson is a Point or LineString
                        lat: item.geometry.coordinates[1],
                        lng: item.geometry.coordinates[0]
                    }
                });
            } catch(e) {
            }
        }
    }
    
    ngOnInit(): void {
        this.loadMap();
    }
}
