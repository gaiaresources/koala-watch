import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonContent, IonHeader, IonTitle, IonToolbar, Platform} from '@ionic/angular/standalone';
import {ClientRecord} from "../../models/client-record";
import {StorageService} from "../../services/storage/storage.service";
import {DATASET_NAME_CENSUS} from "../../tokens/app";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class MapPage implements OnInit {

  @Input()
  dataset?: string;

  @ViewChild('map')
  mapRef?: ElementRef<HTMLElement>;
  // newMap?: GoogleMap;
  // gmapsLoaded: boolean = false;

  _records: ClientRecord[] = [];
  config = {
    center: {
      lat: -25,
      lng: 132,
    },
    zoom: 3.5,
    options: {
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
    }
  }

  markers: any[] = [];

  constructor(
    private platform: Platform,
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    /*
    this.storageService.getAllRecords().then((clientRecord) => {
      if (Array.isArray(clientRecord)) {
        clientRecord.forEach(record => this._records.push( record ));
      }
    });
     */
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  ionViewDidLeave() {
    // if (this.map){
    // this.map.remove();

    // this.cleanup();
    // }
  }

  async loadMap() {
    /*
    if (!this.gmapsLoaded) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApi}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.gmapsLoaded = true;
      };
      document.head.appendChild(script);
    }
    if (this._records && this._records.length) {
      for (const record of this._records) {
        let data = record.data || null;
        if (data &&
          data.hasOwnProperty('Latitude') &&
          data.hasOwnProperty('Longitude')) {
          const title = record.datasetName;
          const snippet = record.datetime;


          const marker = {
            snippet: snippet,
            title: title,
            icon: this.getIconUrl(record),
            coordinate: {
              lat: data['Latitude'],
              lng: data['Longitude'],
            }
          };
          this.markers.push(marker);
        }
      }
    }
     */
  }

  private getIconUrl(record: ClientRecord) {
    let url = 'assets/imgs/';
    url += `${record.datasetName === DATASET_NAME_CENSUS ? 'tree' : 'eye'}-pin-`;
    url += `${record.valid ? 'complete' : 'incomplete'}.png`;
    return {
      url,
      scaledSize: {
        width: 45,
        height: 45
      },
    };
  }
}
