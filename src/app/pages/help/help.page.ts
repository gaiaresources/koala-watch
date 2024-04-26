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
  IonIcon,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { APP_NAME } from "../../tokens/app";
import { UploadService } from "../../services/upload/upload.service";
import { firstValueFrom } from "rxjs";
import { NavigationService } from "../../services/navigation/navigation.service";

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

  doNewTreeSurvey() {
    this.navigationService.goSurvey();
  }

}
