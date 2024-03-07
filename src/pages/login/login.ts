import { Component } from '@angular/core';
import {AlertController, LoadingController, ModalController, NavController, NavParams} from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from '../../biosys-core/services/auth.service';
import { Dataset, User } from '../../biosys-core/interfaces/api.interfaces';
import { APIService } from '../../biosys-core/services/api.service';
import { StorageService } from '../../shared/services/storage.service';
import { formatAPIError } from '../../biosys-core/utils/functions';
import { ApiResponse } from '../../shared/interfaces/mobile.interfaces';

import {
    PROJECT_NAME,
    APP_NAME
} from '../../shared/utils/consts';
import {Router} from "@angular/router";
import {SignupPrivacyPolicyPagePage} from "../signup-privacy-policy-page/signup-privacy-policy-page.page";
import {AuthenticatedService} from "../../shared/services/authenticated.service";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
    styleUrls: ['login.scss']
})
export class LoginPage {
    public form: FormGroup;

    constructor(
                private apiService: APIService,
                private authService: AuthService,
                private storageService: StorageService,
                private formBuilder: FormBuilder,
                private alertController: AlertController,
                private loadingCtrl: LoadingController,
                private router: Router,
                private modalController: ModalController,
                private authenticatedService: AuthenticatedService) {

        console.log("Testing - Login Constructor Called")
        this.form = this.formBuilder.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    public async signup() {
      await this.alertController.create({
        header: 'Terms and Conditions',
          message: 'To sign up to ' + APP_NAME + ' you\'ll need to agree to the following terms and conditions:',
          mode: 'md',
          buttons: [
              {
                  text: 'View',
                  handler: async () => {
                      const modal = await this.modalController.create({
                          component: SignupPrivacyPolicyPagePage
                      })

                      return await modal.present()
                  }
              },
              {
                  text: 'Close',
                  handler: () => {
                  }
              }
          ]
      }).then((alert) => {
        alert.present();
      });
    }

    public async login() {
        const loading = await this.loadingCtrl.create({
            message: 'Logging in'
        });

        await loading.present();

        const username = this.form.value['username'];
        const password = this.form.value['password'];

        this.authService.login(username, password).subscribe(() => {
                const params = {
                    project__name: PROJECT_NAME
                };

                // Update authenticated check for split pane / drawer
                this.authenticatedService.setAuthenticated(this.authService.isLoggedIn())

                this.apiService.getDatasets(params).pipe(
                    mergeMap((datasets: Dataset[]) => from(datasets).pipe(
                        mergeMap((dataset: Dataset) => this.storageService.putDataset(dataset))
                    ))
                ).subscribe(() => {}, error => {
                    console.log(error)
                });

                this.apiService.getUsers(params).pipe(
                    mergeMap((users: User[]) => this.storageService.putTeamMembers(users))
                ).subscribe(() => {}, error => {
                    console.log(error)
                });

                loading?.dismiss()
                this.router.navigateByUrl('/home')
            },
            async (error) => {
                console.log(error)
                loading?.dismiss();
                const apiResponse = formatAPIError(error) as ApiResponse;
                const problem = await this.alertController.create({
                    header: 'Login Problem',
                    subHeader: !!apiResponse.non_field_errors ? apiResponse.non_field_errors[0] :
                        'There was a problem contacting the server, try again later',
                    buttons: ['Ok']
                });
                await problem.present();
            }
        );
    }

    public async resetPassword() {
      const askEmail = await this.alertController.create({
        header: 'Enter your email address',
        subHeader: 'To unlock your account, please enter your email address.',
        buttons: [
          {
            text: 'Ok',
            handler: async (deets) => {
                const waitingForReset = await this.alertController.create({
                    header: 'Resetting your password',
                    subHeader: 'Requesting a password reset for your account...',
                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                    }]
                });

                await waitingForReset.present();

                this.apiService.forgotPassword(deets.email).subscribe(async () => {
                        await waitingForReset.dismiss();
                        const done = await this.alertController.create({
                            header: 'Password Reset',
                            subHeader: 'Your password has been reset. Please check your email for more details.',
                            buttons: [{
                                text: 'OK',
                                role: 'ok',
                            }]
                        });
                        await done.present();
                    },
                    async (resetErr) => {
                        await waitingForReset.dismiss();
                        console.error(resetErr)
                        const done = await this.alertController.create({
                            header: 'Password Reset Problem',
                            subHeader: 'There was a problem resetting your password. Please try again later.',
                            message: resetErr,
                            buttons: [{
                                text: 'OK',
                                role: 'ok',
                            }]
                        });
                        await done.present();
                    });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ],
        inputs: [
          {
            name: 'email',
            type: 'email',
            placeholder: 'Please enter your email address'
          }
        ]
      });

      await askEmail.present();
    }

    protected readonly APP_NAME = APP_NAME;
}
