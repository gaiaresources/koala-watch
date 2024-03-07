import { NgModule } from '@angular/core';
import {AlertController, IonicModule, LoadingController, NavController, NavParams} from '@ionic/angular';
import { ForgotPasswordPage } from './forgot-password';
import {BiosysCoreModule} from "../../biosys-core/biosys-core.module";
import {RouterModule, Routes} from "@angular/router";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {APIService} from "../../biosys-core/services/api.service";

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordPage
  }
]

@NgModule({
  declarations: [
    ForgotPasswordPage,
  ],
    imports: [
        IonicModule,
        BiosysCoreModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    providers: [
        NavController,
        NavParams,
        APIService,
        FormBuilder,
        LoadingController,
        AlertController
    ]
})
export class ForgotPasswordPageModule {}
