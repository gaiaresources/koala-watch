import { NgModule } from '@angular/core';
import {IonicModule, LoadingController, NavController, NavParams, ToastController} from '@ionic/angular';
import { HomePage } from './home';
import { ComponentsModule } from '../../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {BiosysCoreModule} from "../../biosys-core/biosys-core.module";
import {RouterModule, Routes} from "@angular/router";
import {StorageService} from "../../shared/services/storage.service";
import {UploadService} from "../../shared/services/upload.service";

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      { path: 'recordslist', loadChildren: () => import('../../components/records-list/records-list.module').then(m => m.RecordListModule) },
      { path: 'recordsmap', loadChildren: () => import('../../components/records-map/records-map.module').then(m => m.RecordsMapModule) }
    ]
  },
  { path: '', redirectTo: 'home/recordslist', pathMatch: 'full' }
]

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicModule,
    ComponentsModule,
    FontAwesomeModule,
    BiosysCoreModule,
    RouterModule.forChild(routes)
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
