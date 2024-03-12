import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {HomePageModule} from "../pages/home/home.module";
import {HomePage} from "../pages/home/home";

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: "full" },
  { path: 'about', loadChildren: () => import('../pages/about/about.module').then(m => m.AboutPageModule)},
  { path: 'census', loadChildren: () => import('../pages/census/census.module').then(m => m.CensusPageModule)},
  { path: 'forgotpassword', loadChildren: () => import('../pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)},
  { path: 'help', loadChildren: () => import('../pages/help/help.module').then(m => m.HelpPageModule)},
  { path: 'login', loadChildren: () => import('../pages/login/login.module').then(m => m.LoginPageModule)},
  { path: 'mappinpage', loadChildren: () => import('../pages/map-pin-page/map-pin-page.module').then(m => m.MapPinPageModule)},
  { path: 'observation', loadChildren: () => import('../pages/observation/observation.module').then(m => m.ObservationPageModule)},
  { path: 'privacypolicy', loadChildren: () => import('../pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyPageModule)},
  { path: 'settings', loadChildren: () => import('../pages/settings/settings.module').then(m => m.SettingsPageModule)},
  { path: 'signup', loadChildren: () => import('../pages/sign-up/sign-up.module').then(m => m.SignUpPageModule) },
  { path: 'home', component: HomePage },
  // { path: 'home', loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'signup-privacy-policy-page', loadChildren: () => import('../pages/signup-privacy-policy-page/signup-privacy-policy-page.module').then(m => m.SignupPrivacyPolicyPagePageModule) }
];

@NgModule({
  imports: [
    HomePageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
