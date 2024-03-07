import { NgModule } from '@angular/core';
import {AlertController, IonicModule, NavController, NavParams} from '@ionic/angular';
import { SettingsPage } from './settings';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {CommonModule} from "@angular/common";
import {StorageService} from "../../shared/services/storage.service";

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  }
]
@NgModule({
  declarations: [
    SettingsPage,
  ],
    imports: [
        IonicModule,
        CommonModule,
        FontAwesomeModule,
        FormsModule,
      RouterModule.forChild(routes)
    ],
    providers: [
        NavController,
        NavParams,
        StorageService,
        AlertController
    ]
})
export class SettingsPageModule {
  constructor() {
    library.add(faBars);
  }
}
