import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToolbar,
  LoadingController,
  ModalController
} from '@ionic/angular/standalone';
import { APP_NAME } from "../../tokens/app";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { firstValueFrom } from "rxjs";
import { APIService } from "../../services/api/api.service";
import { SignupModalComponent } from "../../components/signup-modal/signup-modal.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonImg, ReactiveFormsModule, IonItem, IonInput, IonButton]
})
export class LoginPage implements OnInit {

  public form: FormGroup;

  constructor(
    @Inject(APP_NAME) private appName: string,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private authenticationService: AuthenticationService,
    private apiService: APIService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  async doLogin() {
    const loading = await this.loadingController.create({
      message: 'Logging in'
    });

    await loading.present();

    const username = this.form.value['username'];
    const password = this.form.value['password'];
    const user = await firstValueFrom(this.authenticationService.login(username, password));

    await loading.dismiss();

    // No user was loaded so show this as an error.
    if (!user) {
      await this.showError();
    } else {
      await this.router.navigateByUrl('/');
    }
  }

  async showError() {
    const lastError = this.apiService.getLastError();
    const alert = await this.alertController.create({
      header: 'Login Problem',
      subHeader: lastError ? lastError :
        'There was a problem contacting the server, try again later',
      buttons: ['Ok']
    });
    await alert.present();
  }

  async doSignup() {
    await this.alertController.create({
      header: 'Terms and Conditions',
      subHeader: 'To sign up to ' + this.appName + ' you\'ll need to agree to the following terms and conditions:',
      mode: 'md',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            const modal = await this.modalController.create({
              component: SignupModalComponent,
            })
            return await modal.present()
          }
        },
        {
          text: 'No',
          handler: () => {
          }
        }
      ]
    }).then((alert) => alert.present());
  }

  async doForgotPassword() {
    const askEmail = await this.alertController.create({
      header: 'Enter your email address',
      subHeader: 'To unlock your account, please enter your email address.',
      buttons: [
        {
          text: 'Ok',
          handler: async (info) => {
            const loading = await this.loadingController.create({
              message: 'Requesting a password reset for your account...',
            });

            await loading.present();

            await firstValueFrom(this.apiService.forgotPassword(info.email))
              .then(async (result) => {
                await loading.dismiss();
                if (result === null) {
                  await this.showPasswordProblem(this.apiService.getLastError());
                } else {
                  await this.showPasswordReset();
                }
              }).catch(async (err) => {
                await loading.dismiss();
                await this.showPasswordProblem(err);
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

  async showPasswordReset() {
    const alert = await this.alertController.create({
      header: 'Password Reset',
      subHeader: 'Your password has been reset. Please check your email for more details.',
      buttons: [{
        text: 'OK',
        role: 'ok',
      }]
    });
    await alert.present();
  }

  async showPasswordProblem(message: string) {
    console.error(message);
    const done = await this.alertController.create({
      header: 'Password Reset Problem',
      subHeader: 'There was a problem resetting your password. Please try again later.',
      message: message ? message : '',
      buttons: [{
        text: 'OK',
        role: 'ok',
      }]
    });
    await done.present();
  }

}
