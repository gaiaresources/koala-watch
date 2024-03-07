import { AppComponent } from './app.component';
import { MbscModule } from '@mobiscroll/angular';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {IonicModule, IonicRouteStrategy, MenuController} from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { StorageService } from '../shared/services/storage.service';
import { APIService } from '../biosys-core/services/api.service';
import { ApiInterceptor } from '../biosys-core/services/api.interceptor';
import { AuthService } from '../biosys-core/services/auth.service';
import { UploadService } from '../shared/services/upload.service';
import { SignupService } from '../shared/services/signup.service';
import { ActiveRecordService } from '../providers/activerecordservice/active-record.service';
import { ComponentsModule } from '../components/components.module';
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "../shared/shared.module";
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from "@fortawesome/free-regular-svg-icons";
import {AuthenticatedService} from "../shared/services/authenticated.service";

@NgModule({
  exports: [RouterModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    MbscModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot({
      scrollAssist: false,
      // autoFocusAssist: false -- No longer part of configuration
    }),
    IonicStorageModule.forRoot(),
    ComponentsModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    StorageService,
    APIService,
    UploadService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandler
    },
    SignupService,
    ActiveRecordService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
      MenuController,
      AuthenticatedService
  ]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far)
  }
}
