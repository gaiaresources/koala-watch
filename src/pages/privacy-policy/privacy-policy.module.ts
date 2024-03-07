import { NgModule } from '@angular/core';
import {IonicModule, NavController, NavParams} from '@ionic/angular';
import { PrivacyPolicyPage } from './privacy-policy';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyPage
  }
]

@NgModule({
  declarations: [
    PrivacyPolicyPage,
  ],
  imports: [
    IonicModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  providers: [
      NavController,
      NavParams
  ]
})
export class PrivacyPolicyPageModule {
  constructor() {
    library.add(faBars);
  }
}
