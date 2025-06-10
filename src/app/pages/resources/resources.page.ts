import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonItemDivider, IonLabel,
} from '@ionic/angular/standalone';
import {HeaderToolbarComponent} from '../../components/header-toolbar/header-toolbar.component';
import {Browser} from '@capacitor/browser';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.page.html',
  styleUrls: ['./resources.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderToolbarComponent, IonItemDivider, IonLabel, IonButton]
})
export class ResourcesPage implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }


  async doOpenKoalaSearch() {
    await Browser.open({ url: 'https://geo.seed.nsw.gov.au/vertigisstudio/web/?app=cabd04d595ec43c1aaf4298e80e83ec2&workflow=36ea26c1-e8e2-4355-8600-5d1558259ad3&workflowParams=%7B%22portalItems%22:%20%5B%7B%22itemId%22:%20%2278e6c517ee764c8c831bc54d2f2ac3ac%22,%20%22layerIds%22:%20%220%22%7D]}'});
  }

  async doOpenKoalaStrategy() {
    await Browser.open({ url: 'https://www2.environment.nsw.gov.au/topics/animals-and-plants/nsw-koala-country/nsw-koala-strategy'});
  }
}
