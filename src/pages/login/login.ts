import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
                private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        })
    }

    ionViewDidLoad() {
    }

    public login() {
        this.authService.login(this.form.value['username'], this.form.value['password']).subscribe(
            () => this.navCtrl.pop()
        );
    }
}
