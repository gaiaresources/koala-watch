import {SignUpPage} from "./sign-up";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AlertController, IonicModule, LoadingController, NavController, NavParams} from "@ionic/angular";
import {BiosysCoreModule} from "../../biosys-core/biosys-core.module";
import {SignupService} from "../../shared/services/signup.service";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: SignUpPage
  }
]

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
      CommonModule,
      FormsModule,
      IonicModule,
      BiosysCoreModule,
      ReactiveFormsModule,
      RouterModule.forChild(routes)
  ],
  providers: [
      NavController,
      NavParams,
      SignupService,
      FormBuilder,
      LoadingController,
      AlertController
  ]
})
export class SignUpPageModule {}
