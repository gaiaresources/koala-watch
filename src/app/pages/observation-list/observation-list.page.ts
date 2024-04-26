import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { RecordsListComponent } from "../../components/records-list/records-list.component";
import { APP_NAME } from "../../tokens/app";
import { ClientRecord } from "../../models/client-record";
import { UploadService } from "../../services/upload/upload.service";
import { NavigationService } from "../../services/navigation/navigation.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'app-observation-list',
  templateUrl: './observation-list.page.html',
  styleUrls: ['./observation-list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RecordsListComponent, IonButtons, IonImg, IonLabel, IonGrid, IonRow, IonCol, IonButton]
})
export class ObservationListPage implements OnInit {

  constructor(
    @Inject(APP_NAME) public appName: string,
    private uploadService: UploadService,
    private navigationService: NavigationService,
  ) {
  }

  ngOnInit() {
  }

  async doUpload() {
    await firstValueFrom(this.uploadService.upload());
  }

  doNewObservation() {
    this.navigationService.goObservation();
  }

  doNewCensus() {
    this.navigationService.goCensus();
  }

}
