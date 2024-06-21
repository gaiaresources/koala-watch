import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonMenuButton,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  IonFabList,
  IonImg,
  IonLabel, IonIcon
} from '@ionic/angular/standalone';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faList, faMap} from "@fortawesome/free-solid-svg-icons";
import {UploadService} from "../../services/upload/upload.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {firstValueFrom} from "rxjs";
import {ActiveRecordService} from "../../services/active-record/active-record.service";

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonTabBar, IonTabButton, IonTabs, IonFab, IonFabButton, IonFabList, IonImg, FaIconComponent, IonLabel, IonIcon]
})
export class ObservationPage implements OnInit {

  public faList = faList;
  public faMap = faMap;

  constructor(
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

  doNewCensus() {
    this.activeRecordService.clear();
    this.navigationService.goCensus();
  }

  doNewObservation() {
    this.activeRecordService.clear();
    this.navigationService.goObservation();
  }

  doNewTreeSurvey() {
    this.activeRecordService.clear();
    this.navigationService.goSurvey();
  }

}
