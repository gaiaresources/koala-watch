import {Routes} from '@angular/router';
import {AuthenticationGuardFn} from "./guards/authentication/authentication.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up.page').then(m => m.SignUpPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.page').then( m => m.AccountPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then(m => m.PrivacyPolicyPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.page').then(m => m.HelpPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'resources',
    loadComponent: () => import('./pages/resources/resources.page').then( m => m.ResourcesPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'records',
    loadComponent: () => import('./pages/records/records.page').then(m => m.RecordsPage),
    canActivate: [AuthenticationGuardFn],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () => import('./pages/records-list/records-list.page').then(m => m.RecordsListPage),
        canActivate: [AuthenticationGuardFn],
      },
      {
        path: 'map',
        loadComponent: () => import('./pages/records-map/records-map.page').then(m => m.RecordsMapPage),
        canActivate: [AuthenticationGuardFn],
      },
    ],
  },
  {
    path: 'observation/:observation',
    loadComponent: () => import('./pages/observation/observation.page').then(m => m.ObservationPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'census/:census',
    loadComponent: () => import('./pages/census/census.page').then(m => m.CensusPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'census-help',
    loadComponent: () => import('./pages/census-help/census-help.page').then(m => m.CensusHelpPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'census/:census/survey/:survey',
    loadComponent: () => import('./pages/survey/survey.page').then(m => m.SurveyPage),
    canActivate: [AuthenticationGuardFn],
  },
];
