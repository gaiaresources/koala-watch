import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../biosys-core/services/auth.service';
import { APIError, Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { APIService } from '../../biosys-core/services/api.service';
import { StorageService } from '../../shared/services/storage.service';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';

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
    public showSpinner = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: APIService,
                private authService: AuthService, private storageService: StorageService,
                private formBuilder: FormBuilder, private alertController: AlertController) {
        this.form = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    public login() {
        this.showSpinner = true;
        this.authService.login(this.form.value['username'], this.form.value['password']).subscribe(() => {
                this.apiService.getDatasets({project__name: 'NSW Koala Data Capture'}).pipe(
                    mergeMap((datasets: Dataset[]) => from(datasets).pipe(
                        mergeMap((dataset: Dataset) => this.storageService.putDataset(dataset))
                    ))
                ).subscribe();
                this.showSpinner = false;
                this.navCtrl.setRoot('HomePage');
            },
            (error) => {
                this.showSpinner = false;
                this.alertController.create({
                title: 'Login Problem',
                subTitle: error.msg.non_field_errors,
                buttons: ['Ok']
            }).present();
            }
        );
    }
}
