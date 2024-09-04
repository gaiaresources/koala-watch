import {enableProdMode, importProvidersFrom} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy, withComponentInputBinding, withRouterConfig} from '@angular/router';
import {provideIonicAngular} from '@ionic/angular/standalone';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthenticationInterceptor} from "./app/services/authentication/authentication.interceptor";
import {APP_NAME, DATASET_OVERRIDES, PROJECT_NAME} from "./app/tokens/app";
import {API_URL} from "./app/tokens/api";
import {IonicStorageModule} from "@ionic/storage-angular";
import {defineCustomElements} from "@ionic/pwa-elements/loader";
import {GOOGLE_MAP_API, GOOGLE_MAP_IDS} from "./app/tokens/gmap";
import {RouteReloadStrategy} from "./app/strategy/route-reload/route-reload.strategy";

defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: RouteReloadStrategy},
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({onSameUrlNavigation: 'reload'})),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(IonicStorageModule.forRoot()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: API_URL,
      useValue: environment.apiUrl,
    },
    {
      provide: APP_NAME,
      useValue: 'I Spy Koala',
    },
    {
      provide: PROJECT_NAME,
      useValue: 'Koala Pilot Project',
    },
    {
      provide: GOOGLE_MAP_API,
      useValue: environment.googleMapsApi,
    },
    {
      provide: GOOGLE_MAP_IDS,
      useValue: ['location-map-selector', 'map'],
    },
    {
      provide: DATASET_OVERRIDES,
      useValue: {
        'Koala Opportunistic Observation': [
          {
            'Reason for Invalidation': {'hidden': true},
            'Observer Name': {'computed': 'user', 'disabled': true},
            'First Date': {'max': 'current', 'defaultValue': 'current'},
          },
        ],
        'Koala Scat Census': [
          {
            'Census ID': {'computed': 'uuid', 'disabled': true},
            'Census Observers': {'computed': 'user', 'disabled': true},
            'Start Date and time': {'max': 'current', 'defaultValue': 'current'},
            'End Date and time': {'defaultValue': 'current'},
          }
        ],
        'Trees Surveyed': [
          {
            'Census ID': {'disabled': true},
            'SiteNo': {'disabled': true},
            'SpeciesCode': {
              'computed': 'value',
              'hidden': true,
              'postProcess': {'type': 'option', 'field': 'ScientificName'}
            },
            'DateFirst': {'max': 'current', 'defaultValue': 'current'},
          }
        ]
      }
    }
  ],
});
