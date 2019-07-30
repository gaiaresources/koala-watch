import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { APP_NAME, UPDATE_BUTTON_NAME } from '../../shared/utils/consts';

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-help',
    templateUrl: 'help.html',
})
export class HelpPage {

    public APP_NAME = APP_NAME;
    public UPDATE_BUTTON_NAME = UPDATE_BUTTON_NAME;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
}
