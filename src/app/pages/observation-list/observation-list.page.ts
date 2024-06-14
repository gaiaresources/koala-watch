import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {RecordsListComponent} from "../../components/records-list/records-list.component";
import {APP_NAME, DATASET_NAME_CENSUS, DATASET_NAME_OBSERVATION} from "../../tokens/app";
import {UploadService} from "../../services/upload/upload.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {firstValueFrom, map, Observable} from "rxjs";
import {RecordsService} from "../../services/records/records.service";
import {ClientRecord} from "../../models/client-record";

@Component({
  selector: 'app-observation-list',
  templateUrl: './observation-list.page.html',
  styleUrls: ['./observation-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RecordsListComponent, IonButtons, IonImg, IonLabel, IonGrid, IonRow, IonCol, IonButton]
})
export class ObservationListPage implements OnInit {
  protected readonly DATASET_NAME_OBSERVATION = DATASET_NAME_OBSERVATION;

  public records$: Observable<ClientRecord[]>;

  constructor(
    @Inject(APP_NAME) public appName: string,
    private uploadService: UploadService,
    private navigationService: NavigationService,
    private recordsService: RecordsService,
  ) {
    this.records$ = this.recordsService.changed$.pipe(
      map(() => {
        const records = this.recordsService
          .getRecords(DATASET_NAME_OBSERVATION)
          .concat(this.recordsService.getRecords(DATASET_NAME_CENSUS));
        // TODO: The records should be ordered by datetime.
        return records;
      })
    );
  }

  ngOnInit() {
  }

  async doUpload() {
    await this.uploadService.upload();
  }

  doNewObservation() {
    this.navigationService.goObservation();
  }

  doNewCensus() {
    this.navigationService.goCensus();
  }

}
