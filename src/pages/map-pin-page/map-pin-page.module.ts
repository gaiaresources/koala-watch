import { NgModule } from '@angular/core';
import {IonicModule, NavController, NavParams, Platform} from '@ionic/angular';
import { MapPinPage } from './map-pin-page';
import {RouterModule, Routes} from "@angular/router";
import {ActiveRecordService} from "../../providers/activerecordservice/active-record.service";
import {LatLng} from "@capacitor/google-maps/dist/typings/definitions";
import {EventService} from "../../shared/services/event.service";

const routes: Routes = [
  {
    path: '',
    component: MapPinPage
  }
]

@NgModule({
  declarations: [
    MapPinPage,
  ],
  imports: [
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
      NavController,
      NavParams,
      EventService,
      Platform,
      ActiveRecordService
  ]
})
export class MapPinPageModule {}
