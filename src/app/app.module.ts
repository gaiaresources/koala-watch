import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AppComponent } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../shared/services/storage.service';
import { MobileAuthService } from '../shared/services/mobile-auth.service';
import { APIService } from '../biosys-core/services/api.service';
import { ApiInterceptor } from '../biosys-core/services/api.interceptor';
import { AuthService } from '../biosys-core/services/auth.service';
import { ComponentsModule } from '../components/components.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        IonicModule.forRoot(AppComponent),
        IonicStorageModule.forRoot(),
        ComponentsModule
    ],
    bootstrap: [IonicApp],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        StorageService,
        GoogleMaps,
        Camera,
        Geolocation,
        APIService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true
        },
        {
            provide: AuthService,
            useClass: MobileAuthService
        },
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        }
    ]
})

export class AppModule {
}
