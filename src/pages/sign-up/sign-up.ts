import { Component } from '@angular/core';
import { Alert, AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { APP_NAME, SIGNUP_TERMS_AND_CONDITIONS_HTML } from '../../shared/utils/consts';
import { FormBuilder, Validators } from '@angular/forms';
import { formatAPIError } from '../../biosys-core/utils/functions';
import { ApiResponse } from '../../shared/interfaces/mobile.interfaces';
import { AuthService } from '../../biosys-core/services/auth.service';
import { SignupService } from '../../shared/services/signup.service';

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  public APP_NAME = APP_NAME;
  public form: any;
  private dialog: Alert;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private signupService: SignupService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private alertController: AlertController,
              private loadingCtrl: LoadingController) {
    this.form = this.formBuilder.group({
      'name_user': ['', Validators.required],
      'name_given': ['', Validators.required],
      'name_last': ['', Validators.required],
      'email': ['', Validators.required, Validators.email],
      'password': ['', Validators.required],
    });
  }

  private signup() {
    if (this.dialog !== undefined) {
      return;
    }
    this.dialog = this.alertController.create({
      title: 'Terms and Conditions',
      subTitle: 'To sign up to I See Koala you\'ll need to agree to the following terms and conditions:',
      message: SIGNUP_TERMS_AND_CONDITIONS_HTML,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.dialog.dismiss();
            this.dialog = undefined;
            this.doSignup();
          }
        },
        {
          text: 'No',
          handler: () => {
            this.dialog.dismiss();
            this.dialog = undefined;
            this.navCtrl.pop();
          }
        }
      ]
    });
    this.dialog.present().then((result) => {
    });
  }


  public doSignup() {
    const loading = this.loadingCtrl.create({
      content: 'Creating Your Account...'
    });
    loading.present();

    const username = this.form.value['name_user'];
    const password = this.form.value['password'];
    const email = this.form.value['email'];
    const first = this.form.value['name_given'];
    const last = this.form.value['name_last'];

    this.signupService.signUp(username, password, email, first, last).subscribe(() => {
      this.alertController.create({
        title: 'Signed Up',
        subTitle: 'Your account has been created, and you can now login!',
        buttons: ['Ok']
      }).present().then(() => {
        this.navCtrl.pop();
      });
      return;
    }, (error) => {
      loading.dismiss().then(() => {/* meh */
      });
      const apiResponse = formatAPIError(error) as ApiResponse;
      let subTitle = !!apiResponse.non_field_errors ? apiResponse.non_field_errors[0] :
        'There was a problem contacting the server, try again later';
      switch (error.status) {
        case 400:
        case 409:
          // technically this is a "account already exists" but we need to be vague?
          subTitle = 'We were unable to create your account. This could be because ' +
            ' your username or email address is already in use, or is invalid. ' +
            'Please check your details and try again.';
          break;
      }
      this.alertController.create({
        title: 'Sign-Up Problem',
        subTitle: subTitle,
        buttons: ['Ok']
      }).present().then(() => {/* meh */
      });
    });
    return;
  }

  ionViewDidLoad() {
  }
}
