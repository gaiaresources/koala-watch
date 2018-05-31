import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../biosys-core/services/auth.service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    public form: FormGroup;

    constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthService,
                private formBuilder: FormBuilder, private alertController: AlertController) {
        this.form = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        })
    }

    public login() {
        this.authService.login(this.form.value['username'], this.form.value['password']).subscribe(
            () => this.navCtrl.setRoot('HomePage'),
            () => this.alertController.create({
                title: 'Login Problem',
                subTitle: 'Incorrect username or password',
                buttons: ['Ok']
            }).present()
        );
    }

    public continueAsGuest() {
        /*  FIXME: The backend needs to support the dataset API endpoint WITHOUT authentication,
            or some sort of weird default auth_token needs to be created, so as to avoid stopping
            a user from entering data despite not having logged in. */
        localStorage.setItem('auth_token', '27eb3ec6b0370f78b7bd5c3ad865c30cf7ea3493');

        this.navCtrl.setRoot('HomePage');
    }
}
