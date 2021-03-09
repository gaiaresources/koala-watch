import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPinPage } from './map-pin-page';

@NgModule({
  declarations: [
    MapPinPage,
  ],
  imports: [
    IonicPageModule.forChild(MapPinPage),
  ],
})
export class MapPinPageModule {}
