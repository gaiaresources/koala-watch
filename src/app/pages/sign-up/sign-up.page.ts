import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
  LoadingController
} from '@ionic/angular/standalone';
import { APP_NAME } from "../../tokens/app";
import { UsernameValidator } from "../../validators/username.validator";
import { PasswordValidator } from "../../validators/password.validator";
import { Errors } from "../../validators/errors";
import { Router } from "@angular/router";
import { APIService } from "../../services/api/api.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonButton, IonCol, IonGrid, IonImg, IonInput, IonItem, IonRow, ReactiveFormsModule]
})
export class SignUpPage implements OnInit, OnDestroy {

  public form: FormGroup;
  public errors: Errors;

  constructor(
    @Inject(APP_NAME) public appName: string,
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private apiService: APIService,
    private alertController: AlertController,
  ) {
    this.form = this.formBuilder.group({
      'name_user': ['', Validators.compose([
        Validators.required,
        UsernameValidator.username,
      ])],
      'name_given': ['', Validators.required],
      'name_last': ['', Validators.required],
      'email': ['', Validators.compose([
        Validators.required,
        Validators.email
      ])
      ],
      'password': ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        PasswordValidator.password,
      ])],
      'password_again': ['', Validators.compose([
        Validators.required,
        PasswordValidator.password,
      ])],
    }, {
      validators: [
        PasswordValidator.match('password', 'password_again'),
      ]
    });

    this.errors = new Errors({
      'name_user': 'Username may only contain alphanumeric characters, or \'.@+-_\'.',
      'name_given': 'Given name is required.',
      'name_last': 'Last name is required.',
      'email': 'Email is required to be valid.',
      'password': 'Password must be between 8 and 16 characters, include at least one each of uppercase, lowercase and digit, and not include the < and > characters.',
      'password_again': "Passwords must match",
    }, this.form);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.errors.unsubscribe();
  }

  async doSignup() {
    const loading = await this.loadingController.create({
      message: 'Creating Your Account...'
    })

    const username = this.form.value['name_user'];
    const password = this.form.value['password'];
    const email = this.form.value['email'];
    const first = this.form.value['name_given'];
    const last = this.form.value['name_last'];

    await loading.present();
    const result = await firstValueFrom(this.apiService.signUp(username, password, email, first, last));
    await loading.dismiss();

    if (result) {
      await this.showSignup();
    } else {
      await this.showProblem();
    }
  }

  doReturn() {
    this.router.navigateByUrl('/login');
  }

  showSignup() {
    this.alertController.create({
      header: 'Signed Up',
      subHeader: 'Your account has been created, and you can now login!',
      buttons: ['Ok']
    }).then((alert) => {
      alert.present().then(() => {
        this.doReturn();
      });
    });
  }

  async showProblem() {
    let lastError = this.apiService.getLastError();

    lastError = lastError ? lastError :
      'There was a problem contacting the server, try again later';

    switch (this.apiService.getLastErrorStatus()) {
      case 400:
        lastError = 'This username is already taken.';
        break;
      case 409:
        // technically this is a "account already exists" but we need to be vague?
        lastError = 'We were unable to create your account. This could be because ' +
          ' your username or email address is already in use, or is invalid. ' +
          'Please check your details and try again.';
        break;
    }

    const alert = await this.alertController.create({
      header: 'Sign-Up Problem',
      subHeader: lastError,
      buttons: ['Ok']
    });
    await alert.present();
  }
}
