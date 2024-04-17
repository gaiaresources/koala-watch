import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonIcon,
    IonMenuButton, IonTabBar, IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import {APP_NAME} from "../../tokens/app";
import {UploadService} from "../../services/upload/upload.service";
import {firstValueFrom} from "rxjs";
import {APIService} from "../../services/api/api.service";
import {Observable} from "rxjs";
import {NavigationService} from "../../services/navigation/navigation.service";

@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
  standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonTabs, IonTabButton, IonTabBar, IonButton, IonIcon]
})
export class RecordsPage implements OnInit {

  records$: Observable<any>;

  constructor(
    @Inject(APP_NAME) public appName: string,
    private apiService: APIService,
    private uploadService: UploadService,
    private navigationService: NavigationService,
  ) {
    this.records$ = this.apiService.getDatasets();
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
