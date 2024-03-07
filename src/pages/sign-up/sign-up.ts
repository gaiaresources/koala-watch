import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonItem, LoadingController, NavController, NavParams} from '@ionic/angular';
import { APP_NAME } from '../../shared/utils/consts';
import { FormBuilder, Validators } from '@angular/forms';
import { formatAPIError } from '../../biosys-core/utils/functions';
import { ApiResponse } from '../../shared/interfaces/mobile.interfaces';
import { SignupService } from '../../shared/services/signup.service';
import {Router} from "@angular/router";

/**
 * Generated class for the SignUpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
  styleUrls: ['sign-up.scss']
})
export class SignUpPage implements OnInit {
  public APP_NAME = APP_NAME;
  public form: any;
  public passwordsMatch = true;
  public passwordsOK = false;
  private passwordsAdvice = '';
  public usernameOK = true;
  private showingSignupMsg: boolean;

  public getPasswordAdvice() {
    if (!this.passwordsMatch) {
      return "Passwords must match"
    } else if (this.passwordsAdvice.trim() !== '') {
      return this.passwordsAdvice
    } else {
      return ""
    }
  }

  constructor(private router: Router,
    private signupService: SignupService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertController: AlertController) {
    this.form = this.formBuilder.group({
      'name_user': ['', Validators.required],
      'name_given': ['', Validators.required],
      'name_last': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required],
      'password_again': ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  public async signup() {
    await this.doSignup();
  }

  public goBack() {
    this.router.navigateByUrl('/login')
  }


  public async doSignup() {
    const loading = await this.loadingCtrl.create({
      message: 'Creating Your Account...'
    })

    await loading.present();

    const username = this.form.value['name_user'];
    const password = this.form.value['password'];
    const password2 = this.form.value['password_again'];
    const email = this.form.value['email'];
    const first = this.form.value['name_given'];
    const last = this.form.value['name_last'];

    this.showingSignupMsg = false;

    this.signupService.signUp(username, password, email, first, last).subscribe(() => {
      loading.dismiss();
      this.alertController.create({
        header: 'Signed Up',
        subHeader: 'Your account has been created, and you can now login!',
        buttons: ['Ok']
      }).then((alert) => {
        alert.present().then(() => {
          // navigate back to the login page:
          this.goBack()
        });
      });
      return;
    }, (error) => {
      loading.dismiss().then(() => {/* meh */ });
      const apiResponse = formatAPIError(error) as ApiResponse;

      let subTitle = !!apiResponse.non_field_errors ? apiResponse.non_field_errors[0] :
        'There was a problem contacting the server, try again later';
      switch (error.status) {
        case 400:
          subTitle = 'This username is already taken.';
          break;
        case 409:
          // technically this is a "account already exists" but we need to be vague?
          subTitle = 'We were unable to create your account. This could be because ' +
            ' your username or email address is already in use, or is invalid. ' +
            'Please check your details and try again.';
          break;
      }

      if (!this.showingSignupMsg) {
        this.showingSignupMsg = true;

        this.alertController.create({
          header: 'Sign-Up Problem',
          subHeader: subTitle,
          buttons: ['Ok']
        }).then((alert) => { alert.present() });
      }
    });
    this.showingSignupMsg = false;
    return;
  }

  public passwordCheck() {
    const thePasswd = this.form.value['password'];
    this.passwordsMatch = this.form.value['password'] === this.form.value['password_again'] || false;
    if (thePasswd.indexOf('>') >= 0 || thePasswd.indexOf('<') >= 0) {
      this.passwordsAdvice = 'Password may not contain < or >';
      this.passwordsOK = false;
      return;
    }
    if (thePasswd.length < 8) {
      this.passwordsAdvice = 'Password is too short';
      this.passwordsOK = false;
      return;
    }
    if (thePasswd.length > 16) {
      this.passwordsAdvice = 'Password is too long';
      this.passwordsOK = false;
      return;
    }
    if (!/[a-z]/.test(thePasswd)) {
      this.passwordsAdvice = 'Password must contain a lower case letter';
      this.passwordsOK = false;
      return;
    }
    if (!/[A-Z]/.test(thePasswd)) {
      this.passwordsAdvice = 'Password must contain an upper case letter';
      this.passwordsOK = false;
      return;
    }
    if (!/[0-9]/.test(thePasswd)) {
      this.passwordsAdvice = 'Password must contain a digit';
      this.passwordsOK = false;
      return;
    }
    this.passwordsAdvice = '';
    this.passwordsOK = true;
  }

  public usernameCheck() {
    const username = this.form.value['name_user'];
    const reg = new RegExp('^[\\w.@+-]+$');
    this.usernameOK = reg.test(username);
  }
}

// FIXME: android:windowSoftInputMode="adjustPan" needs to be added to the Android manifest
