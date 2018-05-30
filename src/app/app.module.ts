import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AppComponent } from './app.component';

import { DynamicFormQuestionComponent } from "../pages/dynamic-form/dynamic-form-question.component";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { QuestionService } from "../pages/dynamic-form/question.service";
import { QuestionControlService } from "../pages/dynamic-form/question-control.service";
import { IonicStorageModule } from "@ionic/storage";
import { GoogleMaps } from "@ionic-native/google-maps";
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../shared/services/storage.service';
import { MobileAuthService } from '../shared/services/mobile-auth.service';
import { LoginPageModule } from '../pages/login/login.module';
import { APIService } from "./biosys-core/services/api.service";
import { ApiInterceptor } from "./biosys-core/services/api.interceptor";
import { AuthService } from "./biosys-core/services/auth.service";
import { ComponentsModule } from "../components/components.module";

@NgModule({
    declarations: [
        AppComponent,
        DynamicFormQuestionComponent,
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
        QuestionService,
        QuestionControlService,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        StorageService,
        GoogleMaps,
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
        },
        StorageService
    ]
})

export class AppModule {
}
