import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AlertController, IonContent, IonHeader, IonTitle, IonToolbar, Platform} from '@ionic/angular/standalone';
import {ClientRecord} from "../../models/client-record";
import {DATASET_NAME_CENSUS} from "../../tokens/app";
import {combineLatest, map, Observable, shareReplay} from "rxjs";
import {RecordsService} from "../../services/records/records.service";
import {GoogleMap, MapAdvancedMarker, MapMarker} from "@angular/google-maps";
import * as dayjs from "dayjs";
import {GoogleMapsService} from "../../services/google-maps/google-maps.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    GoogleMap,
    MapMarker,
    MapAdvancedMarker
  ],
})
export class MapPage implements OnInit {

  options = {
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    mapId: '1234',
  };

  public records$: Observable<{
    position: {
      lat: number,
      lng: number,
    },
    title: string,
    snippet: string,
    icon: google.maps.Icon,
  }[]>;

  constructor(
    private platform: Platform,
    private recordsService: RecordsService,
    private alertController: AlertController,
    private googleMaps: GoogleMapsService,
  ) {
    this.records$ = combineLatest([
      this.recordsService.changed$,
      this.googleMaps.loaded$,
    ]).pipe(
      map(([changed, loaded]) => {
        if (!loaded) return [];
        const records = this.recordsService.getAllRecords();
        return records
          .filter(record => {
            const data = record.data;
            if (!data) return false;
            return data.hasOwnProperty('Latitude') && data.hasOwnProperty('Longitude');
          })
          .map((record) => {
            const data = record.data || {};
            const marker: any = {
              position: {
                lat: (data['Latitude'] ? parseFloat(data['Latitude']) : 0),
                lng: (data['Longitude'] ? parseFloat(data['Longitude']) : 0),

              },
              title: record.datasetName,
              snippet: dayjs(record.datetime).format('DD/MM/YYYY HH:mm'),
              icon: {
                anchor: new google.maps.Point(22.5, 45),
                scaledSize: new google.maps.Size(45, 45),
                url: this.getIconUrl(record),
              }
            };
            return marker;
          });
      }),
      shareReplay(1),
    );
  }

  ngOnInit() {
  }

  doMarkerClick(marker: any, e: google.maps.MapMouseEvent) {
    this.alertController.create({
      header: marker.title,
      message: marker.snippet,
      buttons: ['OK'],
    }).then(alert => alert.present());
  }

  private getIconUrl(record: ClientRecord) {
    let url = 'assets/imgs/';
    url += `${record.datasetName === DATASET_NAME_CENSUS ? 'tree' : 'eye'}-pin-`;
    url += `${record.valid ? 'complete' : 'incomplete'}.png`;
    return url;
  }
}
