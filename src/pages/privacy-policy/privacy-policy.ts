import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { APP_NAME, UPDATE_BUTTON_NAME } from '../../shared/utils/consts';

/**
 * Generated class for the PrivacyPolicy page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-privacy-policy',
    templateUrl: 'privacy-policy.html',
})
export class PrivacyPolicyPage {

    public APP_NAME = APP_NAME;
    public UPDATE_BUTTON_NAME = UPDATE_BUTTON_NAME;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
}
