import { NgModule } from '@angular/core';
import {
    AlertController,
    IonicModule,
    LoadingController,
    ModalController,
    NavController,
    NavParams
} from '@ionic/angular';
import { LoginPage } from './login';
import {BiosysCoreModule} from "../../biosys-core/biosys-core.module";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {APIService} from "../../biosys-core/services/api.service";
import {AuthService} from "../../biosys-core/services/auth.service";
import {StorageService} from "../../shared/services/storage.service";
import {LoginRoutingModule} from "./login-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BiosysCoreModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ],
  declarations: [LoginPage],
  providers: [
      APIService,
      AuthService,
      StorageService,
      FormBuilder,
      AlertController,
      LoadingController,
      ModalController
  ]
})
export class LoginPageModule {}
