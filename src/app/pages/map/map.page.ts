import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, Platform } from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClientRecord } from "../../models/client-record";
import { StorageService } from "../../services/storage/storage.service";
import { DATASET_NAME_CENSUS } from "../../tokens/app";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class MapPage implements OnInit {

  @Input()
  dataset?: string;

  @ViewChild('map')
  mapRef?: ElementRef<HTMLElement>;
  newMap?: GoogleMap;

  _records: ClientRecord[] = [];

  constructor(
    private platform: Platform,
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.storageService.getAllRecords().then((clientRecord) => {
      if (Array.isArray(clientRecord)) {
        clientRecord.forEach(record => this._records.push( record ));
      }
    });
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
    if (!this.mapRef?.nativeElement) {
      return;
    }
    this.newMap = await GoogleMap.create({
      id: 'map',
      element: this.mapRef.nativeElement,
      // TODO How to handle API key?
      apiKey: '',
      config: {
        center: {
          lat: -25,
          lng: 132,
        },
        zoom: 3.5,
      },
    });
    if (this._records && this._records.length) {
      for (const record of this._records) {
        let data = record.data || null;
        if (data &&
          data.hasOwnProperty('Latitude') &&
          data.hasOwnProperty('Longitude')) {
          const title = record.datasetName;
          const snippet = record.datetime;


          const marker = this.newMap.addMarker({
            snippet: snippet,
            title: title,
            iconUrl: this.getIconUrl(record),
            iconSize: {
              width: 45,
              height: 45
            },
            coordinate: {
              lat: data['Latitude'],
              lng: data['Longitude'],
            }
          });
        }
      }
    }
  }

  private getIconUrl(record: ClientRecord) {
    let url = 'assets/imgs/';
    url += `${record.datasetName === DATASET_NAME_CENSUS ? 'tree' : 'eye'}-pin-`;
    url += `${record.valid ? 'complete' : 'incomplete'}.png`;
    return url;
  }
}
