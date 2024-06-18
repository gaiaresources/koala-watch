import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonContent, IonHeader, IonTitle, IonToolbar, Platform} from '@ionic/angular/standalone';
import {ClientRecord} from "../../models/client-record";
import {DATASET_NAME_CENSUS} from "../../tokens/app";
import {GoogleMapComponent} from "../../components/google-map/google-map.component";
import {GoogleMapMarkerComponent} from "../../components/google-map-marker/google-map-marker.component";
import {map, Observable, shareReplay} from "rxjs";
import {RecordsService} from "../../services/records/records.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, GoogleMapComponent, GoogleMapMarkerComponent],
})
export class MapPage implements OnInit {

  public records$: Observable<{
    snippet: string,
    title: string,
    icon: any,
    lat: number,
    lng: number,
  }[]>;

  constructor(
    private platform: Platform,
    private recordsService: RecordsService,
  ) {
    this.records$ = this.recordsService.changed$.pipe(
      map(() => {
        const records = this.recordsService.getAllRecords();

        return records
          .filter(record => {
            const data = record.data;
            if (!data) return false;
            return data.hasOwnProperty('Latitude') && data.hasOwnProperty('Longitude');
          })
          .map((record) => {
            const data = record.data || {};
            return {
              snippet: "",
              title: "",
              icon: this.getIconUrl(record),
              lat: (data['Latitude'] ? parseFloat(data['Latitude']) : 0),
              lng: (data['Longitude'] ? parseFloat(data['Longitude']) : 0),
            }
          });
      }),
      shareReplay(1),
    );
  }

  ngOnInit() {
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
