import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ObservationPage } from '../pages/observation/observation';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DynamicFormQuestionComponent } from '../pages/dynamic-form/dynamic-form-question.component';
import { QuestionService } from '../pages/dynamic-form/question.service';
import { QuestionControlService } from '../pages/dynamic-form/question-control.service';
import { StorageService } from '../shared/services/storage.service';
import { IonicStorageModule } from '@ionic/storage';
import { DataList } from '../pages/data-list/data-list';
import { APIService } from '../biosys-core/services/api.service';
import { AuthService } from '../biosys-core/services/auth.service';
import { MobileAuthService } from '../shared/services/mobile-auth.service';
import { LoginPageModule } from '../pages/login/login.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiInterceptor } from '../biosys-core/services/api.interceptor';

@NgModule({
    declarations: [
        AppComponent,
        HomePage,
        ListPage,
        ObservationPage,
        DynamicFormQuestionComponent,
        DataList
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        IonicModule.forRoot(AppComponent),
        IonicStorageModule.forRoot(),
        LoginPageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        AppComponent,
        HomePage,
        ListPage,
        ObservationPage,
        DataList
    ],
    providers: [
        StatusBar,
        SplashScreen,
        QuestionService,
        QuestionControlService,
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
