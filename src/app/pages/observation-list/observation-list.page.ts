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
import {APP_NAME, DATASET_NAME_OBSERVATION} from "../../tokens/app";
import {UploadService} from "../../services/upload/upload.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {combineLatest, map, Observable} from "rxjs";
import {RecordsService} from "../../services/records/records.service";
import {ClientRecord} from "../../models/client-record";
import {ActiveRecordService} from "../../services/active-record/active-record.service";
import {SettingsService} from "../../services/settings/settings.service";

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
    private activeRecordService: ActiveRecordService,
    private settingsService: SettingsService,
  ) {
    this.records$ = combineLatest([
      this.recordsService.changed$,
      this.settingsService.values$,
    ]).pipe(
      map(([_, settings]) => {
        const records = this.recordsService.getAllRecords();
        // TODO: The records should be ordered by datetime.
        return records.filter((record) => {
          return !settings.hideUploaded || !record.isUploaded();
        });
      })
    );
  }

  ngOnInit() {
  }

  async doUpload() {
    await this.uploadService.upload();
  }

  doNewObservation() {
    this.activeRecordService.clear();
    this.navigationService.goObservation();
  }

  doNewCensus() {
    this.activeRecordService.clear();
    this.navigationService.goCensus();
  }

}
