import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-observation-photos',
  templateUrl: './observation-photos.page.html',
  styleUrls: ['./observation-photos.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ObservationPhotosPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
