import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from '../../biosys-core/services/api.service';
import { APIError } from '../../biosys-core/interfaces/api.interfaces';
import { formatAPIError } from '../../biosys-core/utils/functions';
import { ApiResponse } from '../../shared/interfaces/mobile.interfaces';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
    public form: FormGroup;
    public isPasswordResetRequestSent = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: APIService,
                private formBuilder: FormBuilder, private loadingCtrl: LoadingController, private alertController: AlertController) {
        this.form = formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    public forgotPassword() {
        const loading = this.loadingCtrl.create({
            content: 'Submitting password reset'
        });
        loading.present();

        const email = this.form.value['email'];

        this.apiService.forgotPassword(email).subscribe(
            () => this.isPasswordResetRequestSent = true,
            (apiError: APIError) => {
                loading.dismiss();
                const apiResponse = formatAPIError(apiError);
                let error: string;

                if ('non_field_errors' in apiResponse) {
                    error = apiResponse['non_field_errors'][0];
                } else if ('email' in apiResponse) {
                    error = apiResponse['email'];
                } else {
                    error = 'There was a problem contacting the server, try again later';
                }

                this.alertController.create({
                    title: 'Password Reset Problem',
                    subTitle: error,
                    buttons: ['Ok']
                }).present();
            },
            () => loading.dismiss()
        );
    }

}
