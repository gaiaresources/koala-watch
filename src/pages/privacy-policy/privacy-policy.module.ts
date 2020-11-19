import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPolicy } from './privacy-policy';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
@NgModule({
  declarations: [
    PrivacyPolicy,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyPolicy),
    FontAwesomeModule
  ],
  entryComponents: [
    PrivacyPolicy,
  ]
})
export class PrivacyPolicyModule {
  constructor() {
    library.add(faBars);
  }
}
