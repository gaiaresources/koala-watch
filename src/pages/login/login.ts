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
        this.navCtrl.setRoot('HomePage');
    }
}
