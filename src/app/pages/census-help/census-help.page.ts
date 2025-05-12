import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonImg, IonItemDivider,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import {APP_NAME} from '../../tokens/app';
import {ImageIconComponent} from '../../components/image-icon/image-icon.component';
import {HeaderToolbarComponent} from '../../components/header-toolbar/header-toolbar.component';
import {NavigationService} from '../../services/navigation/navigation.service';
import {UploadService} from '../../services/upload/upload.service';

@Component({
  selector: 'app-census-help',
  templateUrl: './census-help.page.html',
  styleUrls: ['./census-help.page.scss'],
  standalone: true,
  imports: [IonContent, IonItemDivider, CommonModule, FormsModule, IonGrid, IonRow, IonCol, IonImg, IonButton, IonLabel, ImageIconComponent, HeaderToolbarComponent]
})
export class CensusHelpPage implements OnInit {

  constructor(
    @Inject(APP_NAME) public appName: string,
  ) {
  }

  ngOnInit() {
  }

}
