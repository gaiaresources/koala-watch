import {
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsEvent,
    LatLng, Marker,
} from '@ionic-native/google-maps';
import { Component, OnInit } from "@angular/core/";

@Component({
    selector: 'records-map',
    templateUrl: 'records-map.html'
})
export class RecordsMapComponent {
    private map: GoogleMap;
    
    private randoCoordMins = {
        "lon": 117.50976562499999,
        "lat": -33.504759069226075
    };
    private randoCoordDeltas = {
        "lon": 31.11328,
        "lat": 12.2563368336
    };
    
    constructor() { }
    
    public ionViewDidLoad() {
        this.loadMap();
    }
    
    private loadMap() {
        let location = new LatLng(-25,132);
        let mapOptions: GoogleMapOptions = {
            'backgroundColor': 'white',
            'controls': {
                'compass': true,
                //'myLocationButton': true,
                'zoom': true
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
        
        // create 20 random points:
        for (let i=0; i < 20; i++) {
            const colours = ['blue', 'red', 'purple', 'green' ];
            
            
            let marker: Marker = this.map.addMarkerSync({
                title: "Point " + i.toString(10),
                icon: colours[i % 4],
                animation: 'DROP',
                position: {
                    lat: this.randoCoordMins.lat + (Math.random() * this.randoCoordDeltas.lat),
                    lng: this.randoCoordMins.lon + (Math.random() * this.randoCoordDeltas.lon)
                }
            });
        }
        return;
    }
}
