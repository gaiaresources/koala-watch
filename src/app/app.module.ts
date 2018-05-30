import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ObservationPage } from '../pages/observation/observation';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DynamicFormQuestionComponent } from "../pages/dynamic-form/dynamic-form-question.component";
import { QuestionService } from "../pages/dynamic-form/question.service";
import { QuestionControlService } from "../pages/dynamic-form/question-control.service";
import { StorageService } from "./storage.service";
import { IonicStorageModule } from "@ionic/storage";
import { DataList } from "../pages/data-list/data-list";
import { HomeMapPage } from "../pages/home-map/home-map";
import { GoogleMap, GoogleMaps } from "@ionic-native/google-maps";
import { HomeTabsPage } from "../pages/home-tabs/home-tabs";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        ListPage,
        ObservationPage,
        DynamicFormQuestionComponent,
        DataList,
        HomeMapPage,
        HomeTabsPage
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        ListPage,
        ObservationPage,
        DataList,
        HomeMapPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        QuestionService,
        QuestionControlService,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        StorageService,
        GoogleMaps
    ]
})

export class AppModule {}
