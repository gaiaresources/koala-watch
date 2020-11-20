import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPolicyPage } from './privacy-policy';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
@NgModule({
  declarations: [
    PrivacyPolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacyPolicyPage),
    FontAwesomeModule
  ],
  entryComponents: [
    PrivacyPolicyPage,
  ]
})
export class PrivacyPolicyPageModule {
  constructor() {
    library.add(faBars);
  }
}
