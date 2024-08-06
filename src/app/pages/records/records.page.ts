import {Component, OnInit} from '@angular/core';
import {UploadService} from "../../services/upload/upload.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {faList, faMap} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  IonButtons,
  IonContent,
  IonFab,
  IonHeader,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {FabButtonComponent} from "../../components/fab-button/fab-button.component";
import {FabSlotComponent} from "../../components/fab-slot/fab-slot.component";
import {RecordsService} from "../../services/records/records.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {ClientRecord} from "../../models/client-record";

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
    FabButtonComponent,
    FabSlotComponent,
    NgIf,
    AsyncPipe
  ]
})
export class RecordsPage implements OnInit {

  public faList = faList;
  public faMap = faMap;

  public records$: Observable<ClientRecord[]>;

  constructor(
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

  doNewCensus() {
    this.navigationService.goCensus();
  }

  doNewObservation() {
    this.navigationService.goObservation();
  }

}
