import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ClientRecord} from "../../models/client-record";
import {APP_NAME} from "../../tokens/app";
import {UploadService} from "../../services/upload/upload.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {RecordsService} from "../../services/records/records.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {RecordListComponent} from "../../components/record-list/record-list.component";
import {IonButton, IonContent, IonLabel} from "@ionic/angular/standalone";

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.page.html',
  styleUrls: ['./records-list.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RecordListComponent,
    IonContent,
    IonButton,
    IonLabel,
  ]
})
export class RecordsListPage implements OnInit {

  public records$: Observable<ClientRecord[]>;

  constructor(
    @Inject(APP_NAME) public appName: string,
    private uploadService: UploadService,
    private navigationService: NavigationService,
    private recordsService: RecordsService,
  ) {
    this.records$ = this.recordsService.getDisplayRecords$();
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
