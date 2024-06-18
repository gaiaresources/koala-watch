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
  IonIcon,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {APP_NAME} from "../../tokens/app";
import {UploadService} from "../../services/upload/upload.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {ActiveRecordService} from "../../services/active-record/active-record.service";

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonImg, IonButton, IonIcon, IonLabel]
})
export class HelpPage implements OnInit {

  constructor(
    @Inject(APP_NAME) public appName: string,
    private uploadService: UploadService,
    private navigationService: NavigationService,
    private activeRecordService: ActiveRecordService,
  ) {
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

  doNewTreeSurvey() {
    this.activeRecordService.clear();
    this.navigationService.goSurvey();
  }

}
