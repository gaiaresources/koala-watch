import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapCoordinatesPage } from './map-coordinates';

@NgModule({
  declarations: [
    MapCoordinatesPage,
  ],
  imports: [
    IonicPageModule.forChild(MapCoordinatesPage),
  ],
  bootstrap: [MapCoordinatesPage]
})
export class MapCoordinatesPageModule {}
