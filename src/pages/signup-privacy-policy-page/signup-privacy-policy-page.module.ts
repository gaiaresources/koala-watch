import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {IonicModule, ModalController} from '@ionic/angular';

import { SignupPrivacyPolicyPagePageRoutingModule } from './signup-privacy-policy-page-routing.module';

import { SignupPrivacyPolicyPagePage } from './signup-privacy-policy-page.page';
import {Router} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPrivacyPolicyPagePageRoutingModule
  ],
  providers: [
      ModalController,
      Router
  ],
  declarations: [SignupPrivacyPolicyPagePage]
})
export class SignupPrivacyPolicyPagePageModule {}
