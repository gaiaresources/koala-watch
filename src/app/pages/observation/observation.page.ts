import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButtons,
  IonContent, IonFab, IonFabButton,
  IonHeader,
  IonMenuButton,
  IonTabBar, IonTabButton, IonTabs,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonTabBar, IonTabButton, IonTabs, IonFab, IonFabButton]
})
export class ObservationPage implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
