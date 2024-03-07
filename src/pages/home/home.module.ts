import { NgModule } from '@angular/core';
import {IonicModule, LoadingController, NavController, NavParams, ToastController} from '@ionic/angular';
import { HomePage } from './home';
import { ComponentsModule } from '../../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {BiosysCoreModule} from "../../biosys-core/biosys-core.module";
import {StorageService} from "../../shared/services/storage.service";
import {UploadService} from "../../shared/services/upload.service";

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    BiosysCoreModule,
  ],
  providers: [
    NavController,
    NavParams,
    LoadingController,
    ToastController,
    StorageService,
    UploadService
  ]
})
export class HomePageModule {
  constructor() {
    library.add(faBars);
  }
}
