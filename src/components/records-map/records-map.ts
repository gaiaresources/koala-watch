import { Marker } from '@capacitor/google-maps';
import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import {NavParams, Platform} from '@ionic/angular';
import {timer} from 'rxjs';
import { isDatasetCensus } from '../../shared/utils/functions';
import moment from "moment";
import {EventService} from "../../shared/services/event.service";
import {environment} from "../../environments/environment";

@Component({
    selector: 'records-map',
    templateUrl: 'records-map.html',
    styleUrls: ['records-map.scss']
})
export class RecordsMapComponent {

    @ViewChild('map') mapRef?: ElementRef;

    @Input()
    public set records(records: ClientRecord[]) {
        this._records = records;
    }

    private map?: google.maps.Map;
    private markers: google.maps.Marker[] = []
    private dragMarker?: Marker;


    private _records?: ClientRecord[];

    constructor(private navParams: NavParams,
                private events: EventService,
                private platform: Platform) {
        console.log("Testing - Records-Map Constructor called")
    }

    ionViewDidEnter() {
        console.log("Testing - Records Map ionViewDidEnter called")
      this.platform.ready().then(() => {
        console.log("Testing - Running load map")
        this.loadMap();
      });
    }

    ionViewDidLeave() {
      if (this.map){
        this.map?.unbindAll()
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
      console.log("Testing - Loading map")
      if (this.mapRef?.nativeElement != null) {
        console.log("Testing - Found element")
        this.map = new google.maps.Map(this.mapRef.nativeElement, {
          center: { lat: -25, lng: 132 },
          zoom: 3.5
        })
      }

      if (this.navParams.data.hasOwnProperty('data')) {
        console.log("Testing - Found data")
        this.records = this.navParams.get('data');
      }

      this.events.getObservableForEvent('home-willenter').subscribe(() => this.ionViewWillEnter());
      this.events.getObservableForEvent('map-whereispin').subscribe(() => this.dragMarkerLocation());
    }

    public ionViewWillEnter() {
        console.log("Testing - Records-map ionViewWillEnter called")
        timer(500).subscribe(() => this.loadMarkers());
    }

    private dragMarkerLocation() {
      this.events.publish('map-specifiedcoordinates', this.dragMarker?.coordinate);
    }

    private loadMarkers() {
        console.log("Testing - Loading Markers for records-map")
        if (this.map) {
          console.log("Testing - Found map")
          this.removeMarkers()
          if (this._records && this._records.length) {
            for (const record of this._records) {
              if (record.hasOwnProperty('data') &&
                record.data?.hasOwnProperty('Latitude') &&
                record.data.hasOwnProperty('Longitude')) {
                const title = record.datasetName;
                const snippet = moment(record.datetime).format('DD/MM/YYYY HH:mm');
                let url = 'assets/imgs/';
                url += `${isDatasetCensus(record.datasetName) ? 'tree' : 'eye'}-pin-`;
                url += `${record.valid ? 'complete' : 'incomplete'}.png`;

                this.addMarker(
                  record.data["Latitude"],
                  record.data["Longitude"],
                  title,
                  snippet,
                  url
                )
              }
            }
          }
        }
    }

    private removeMarkers() {
      this.markers.forEach(marker => {
        marker.setMap(null);
      });

      this.markers = [];
    }

    private addMarker(lat: any, lng: any, title: string, snippet: string, iconUrl: string) {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: title,
        icon: iconUrl? { url: iconUrl, scaledSize: new google.maps.Size(45, 45) } : null
      })

      if (title) {
        const infoWindow = new google.maps.InfoWindow({
          content: snippet
        })

        marker.addListener('click', () => {
          infoWindow.open(this.map, marker)
        })
      }

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

      this.markers.push(marker)
    }

}
