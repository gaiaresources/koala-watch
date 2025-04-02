import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonLabel,
  IonRow,
  IonToggle,
  LoadingController
} from '@ionic/angular/standalone';
import {Observable} from "rxjs";
import {SettingsService} from "../../services/settings/settings.service";
import {RecordsService} from "../../services/records/records.service";
import {HeaderToolbarComponent} from '../../components/header-toolbar/header-toolbar.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonCard, IonCardContent, IonGrid, IonRow, IonLabel, IonToggle, IonButton, HeaderToolbarComponent]
})
export class SettingsPage implements OnInit {

  settings$: Observable<any>;

  constructor(
    private settingsService: SettingsService,
    private recordsService: RecordsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    this.settings$ = this.settingsService.values$;
  }

  ngOnInit() {
  }

  update(key: string, value: any) {
    this.settingsService.set(key, value);
  }

  async doClearUploaded() {
    const loader = await this.loadingCtrl.create({
      message: "Removing uploaded records",
    })
    await loader.present();

    await this.recordsService.deleteUploadedRecords();

    await loader.dismiss();
    const alert = await this.alertCtrl.create({
      header: "Settings",
      message: "Uploaded records deleted",
    });
    await alert.present();
  }

}
