import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from '../../biosys-core/services/auth.service';
import { Dataset, User } from '../../biosys-core/interfaces/api.interfaces';
import { APIService } from '../../biosys-core/services/api.service';
import { StorageService } from '../../shared/services/storage.service';
import { formatAPIError } from '../../biosys-core/utils/functions';
import { ApiResponse } from '../../shared/interfaces/mobile.interfaces';

import { PROJECT_NAME } from '../../shared/utils/consts';

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
                private formBuilder: FormBuilder, private alertController: AlertController, private loadingCtrl: LoadingController) {
        this.form = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    public login() {
        const loading = this.loadingCtrl.create({
            content: 'Logging in'
        });
        loading.present();

        this.authService.login(this.form.value['username'], this.form.value['password']).subscribe(() => {
                this.apiService.getDatasets({project__name: PROJECT_NAME }).pipe(
                    mergeMap((datasets: Dataset[]) => from(datasets).pipe(
                        mergeMap((dataset: Dataset) => this.storageService.putDataset(dataset))
                    ))
                ).subscribe();

                this.apiService.getUsers({project__name: PROJECT_NAME}).pipe(
                    mergeMap((users: User[]) => this.storageService.putTeamMembers(users))
                ).subscribe();

                loading.dismiss();
                this.navCtrl.setRoot('HomePage');
            },
            (error) => {
                loading.dismiss();
                const apiResponse = formatAPIError(error) as ApiResponse;
                this.alertController.create({
                    title: 'Login Problem',
                    subTitle: !!apiResponse.non_field_errors ? apiResponse.non_field_errors[0] :
                        'There was a problem contacting the server, try again later',
                    buttons: ['Ok']
                }).present();
            }
        );
    }
}
