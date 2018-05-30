import {
    GoogleMap,
    GoogleMapOptions,
    GoogleMaps,
    GoogleMapsEvent,
    LatLng, Marker,
} from '@ionic-native/google-maps';
import { Component, OnInit } from "@angular/core/";

@Component({
    selector: 'home-map',
    templateUrl: 'home-map.html'
})
export class HomeMapPage {
    private map: GoogleMap;
    constructor() { }
    
    ionViewDidLoad() {
        this.loadMap();
    }
    
    loadMap() {
    
    
        let location = new LatLng(-34.9290,138.6010);
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
            }
        };
        
        this.map = GoogleMaps.create('map', mapOptions);
    }
}
