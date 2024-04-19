import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthenticationInterceptor } from "./app/services/authentication/authentication.interceptor";
import { APP_NAME, PROJECT_NAME } from "./app/tokens/app";
import { API_URL } from "./app/tokens/api";
import { IonicStorageModule } from "@ionic/storage-angular";
import { defineCustomElements } from "@ionic/pwa-elements/loader";

defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding()),
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
  ],
});
