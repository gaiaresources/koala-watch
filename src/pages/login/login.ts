import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../biosys-core/services/auth.service';
import { APIError, Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { APIService } from '../../biosys-core/services/api.service';
import { StorageService } from '../../shared/services/storage.service';

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: APIService,
                private authService: AuthService, private storageService: StorageService,
                private formBuilder: FormBuilder, private alertController: AlertController) {
        this.form = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        })
    }

    public login() {
        this.authService.login(this.form.value['username'], this.form.value['password']).subscribe(() => {
                this.apiService.getDatasets({name: 'Koala Opportunistic Observation'}).subscribe(
                    (datasets: Dataset[]) => this.storageService.putDataset(datasets[0]),
                );
                this.navCtrl.setRoot('HomePage')
            },
            (error) => this.alertController.create({
                title: 'Login Problem',
                subTitle: error.msg,
                buttons: ['Ok']
            }).present()
        );
    }
}
