import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPinModalPage } from './map-pin-modal';

@NgModule({
  declarations: [
    MapPinModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MapPinModalPage),
  ],
})
export class MapPinModalPageModule {}
