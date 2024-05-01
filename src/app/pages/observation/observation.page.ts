import { Component, OnInit } from '@angular/core';
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
  IonLabel
} from '@ionic/angular/standalone';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faList, faMap} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonTabBar, IonTabButton, IonTabs, IonFab, IonFabButton, IonFabList, IonImg, FaIconComponent, IonLabel]
})
export class ObservationPage implements OnInit {

  public faList = faList;
  public faMap = faMap;

  constructor() {
  }

  ngOnInit() {
  }

}
