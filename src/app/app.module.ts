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
import { APIService } from '../biosys-core/services/api.service';
import { ApiInterceptor } from '../biosys-core/services/api.interceptor';
import { AuthService } from '../biosys-core/services/auth.service';
import { ComponentsModule } from '../components/components.module';
import { UploadService } from '../shared/services/upload.service';
import { SignupService } from '../shared/services/signup.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTachometerAlt, faCog, faInfoCircle, faQuestionCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        IonicModule.forRoot(AppComponent, {
          scrollAssist: false,
          autoFocusAssist: false
        }),
        IonicStorageModule.forRoot(),
        ComponentsModule,
        FontAwesomeModule
    ],
    bootstrap: [IonicApp],
    providers: [
        StatusBar,
        SplashScreen,
        StorageService,
        GoogleMaps,
        Camera,
        Geolocation,
        APIService,
        UploadService,
        AuthService,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true
        },
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        SignupService
    ]
})
export class AppModule {
    constructor() {
        library.add(faTachometerAlt, faCog, faInfoCircle, faQuestionCircle, faSignOutAlt);
    }
}
