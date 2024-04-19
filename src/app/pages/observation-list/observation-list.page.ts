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
import { Router } from "@angular/router";
import { ClientRecord } from "../../models/client-record";

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
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  doNewObservation() {
    this.router.navigateByUrl('/observation/form');
  }

  doNewCensus() {
    this.router.navigateByUrl('/census/form');
  }

  doUploadObservation() {
    // this.router.navigateByUrl('/obser')
  }

  doRecord(record: ClientRecord) {
  }

}
