import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPrivacyPolicyPagePage } from './signup-privacy-policy-page.page';

const routes: Routes = [
  {
    path: '',
    component: SignupPrivacyPolicyPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPrivacyPolicyPagePageRoutingModule {}
