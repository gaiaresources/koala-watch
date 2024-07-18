import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToggle,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import {Observable} from "rxjs";
import {SettingsService} from "../../services/settings/settings.service";
import {RecordsService} from "../../services/records/records.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCard, IonCardContent, IonGrid, IonRow, IonLabel, IonToggle, IonButton]
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
