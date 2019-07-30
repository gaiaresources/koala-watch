import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { StorageService } from '../../shared/services/storage.service';
import { mergeMap } from 'rxjs/operators';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    public hideUploaded: boolean;

    public ionChangeHideUploaded(event) {
        this.saveSetting('hideUploaded', this.hideUploaded);
    }

    public clickDeleteUploadedRecords() {
        this.storageService.getAllUploadedRecords().pipe(mergeMap(clientRecord =>
            this.storageService.deleteRecord(clientRecord.client_id))).subscribe({
                complete: () => {
                    this.alertController.create({
                        title: 'Settings',
                        message: 'Uploaded records deleted',
                        enableBackdropDismiss: true,
                        buttons: [{text: 'Ok'}]
                    }).present();
                }
            }
        );
    }

    constructor(public navCtrl: NavController, public navParams: NavParams, private storageService: StorageService,
        private alertController: AlertController) {
    }

    public ionViewWillEnter() {
        this.storageService.getSetting('hideUploaded').subscribe( setting => this.hideUploaded = JSON.parse(setting));
    }

    private saveSetting(name: string, setting: boolean) {
        this.storageService.putSetting(name, JSON.stringify(setting)).subscribe();
    }

}
