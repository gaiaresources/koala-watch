import { Routes } from '@angular/router';
import { AuthenticationGuardFn } from "./services/authentication/authentication.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'observation',
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
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then(m => m.PrivacyPolicyPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.page').then(m => m.HelpPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'observation',
    loadComponent: () => import('./pages/observation/observation.page').then(m => m.ObservationPage),
    canActivate: [AuthenticationGuardFn],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () => import('./pages/observation-list/observation-list.page').then(m => m.ObservationListPage),
        canActivate: [AuthenticationGuardFn],
      },
      {
        path: 'map',
        loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage),
        canActivate: [AuthenticationGuardFn],
        data: {dataset: 'observation'},
      },
    ],
  },
  {
    path: 'observation/form',
    loadComponent: () => import('./pages/observation-form/observation-form.page').then(m => m.ObservationFormPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'census',
    loadComponent: () => import('./pages/census/census.page').then(m => m.CensusPage),
    canActivate: [AuthenticationGuardFn],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () => import('./pages/list/list.page').then(m => m.ListPage),
        canActivate: [AuthenticationGuardFn],
        data: {dataset: 'census'},
      },
      {
        path: 'map',
        loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage),
        canActivate: [AuthenticationGuardFn],
        data: {dataset: 'census'},
      },
    ],
  },
  {
    path: 'census/form',
    loadComponent: () => import('./pages/census-form/census-form.page').then(m => m.CensusFormPage),
    canActivate: [AuthenticationGuardFn],
  },
  {
    path: 'survey',
    loadComponent: () => import('./pages/survey/survey.page').then(m => m.SurveyPage),
    canActivate: [AuthenticationGuardFn],
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadComponent: () => import('./pages/list/list.page').then(m => m.ListPage),
        canActivate: [AuthenticationGuardFn],
        data: {dataset: 'census'},
      },
      {
        path: 'map',
        loadComponent: () => import('./pages/map/map.page').then(m => m.MapPage),
        canActivate: [AuthenticationGuardFn],
        data: {dataset: 'census'},
      },
    ],
  },
  {
    path: 'survey/form',
    loadComponent: () => import('./pages/survey-form/survey-form.page').then(m => m.SurveyFormPage),
    canActivate: [AuthenticationGuardFn],
  },
];
