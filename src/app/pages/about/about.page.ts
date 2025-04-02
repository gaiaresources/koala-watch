import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonLabel,
} from '@ionic/angular/standalone';
import { APP_NAME } from "../../tokens/app";
import {HeaderToolbarComponent} from '../../components/header-toolbar/header-toolbar.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderToolbarComponent, IonLabel]
})
export class AboutPage implements OnInit {

  constructor(
    @Inject(APP_NAME) public appName: string,
  ) {
  }

  ngOnInit() {
  }

}
