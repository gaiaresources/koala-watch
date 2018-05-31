import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    public data = {
        jon: true,
        daenerys: true,
        arya: false,
        tyroin: false,
        sansa: true,
        khal: false,
        cersei: true,
        stannis: true,
        petyr: false,
        hodor: true,
        catelyn: true,
        bronn: false
    };
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
}
