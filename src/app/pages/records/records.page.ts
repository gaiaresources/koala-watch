import {Component, OnInit} from '@angular/core';
import {UploadService} from "../../services/upload/upload.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {faList, faMap} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
  standalone: true,
  imports: [
    FaIconComponent,
    IonImg,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList
  ]
})
export class RecordsPage implements OnInit {

  public faList = faList;
  public faMap = faMap;

  constructor(
    private uploadService: UploadService,
    private navigationService: NavigationService,
  ) {
  }

  ngOnInit() {
  }

  async doUpload() {
    await this.uploadService.upload();
  }

  doNewCensus() {
    this.navigationService.goCensus();
  }

  doNewObservation() {
    this.navigationService.goObservation();
  }

}
