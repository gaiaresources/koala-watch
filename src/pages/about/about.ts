import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import {APP_NAME} from '../../shared/utils/consts';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
    styleUrls: ['about.scss']
})
export class AboutPage {
    public APP_NAME = APP_NAME;
    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
    }
}
