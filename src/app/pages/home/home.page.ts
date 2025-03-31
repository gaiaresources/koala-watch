import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonLabel,
} from '@ionic/angular/standalone';
import { APP_NAME } from "../../tokens/app";
import {HeaderToolbarComponent} from '../../components/header-toolbar/header-toolbar.component';
import {NavigationService} from '../../services/navigation/navigation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent , CommonModule, FormsModule, HeaderToolbarComponent, IonLabel, IonButton]
})
export class HomePage implements OnInit {

  constructor(
    @Inject(APP_NAME) public appName: string,
    private navigationService: NavigationService,
  ) {
  }

  ngOnInit() {
  }

  doNewObservation() {
    this.navigationService.goObservation();
  }
}
