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
import {APIService} from "./biosys-core/services/api.service";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ObservationPage,
    DynamicFormQuestionComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ObservationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QuestionService,
    QuestionControlService,
    APIService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
