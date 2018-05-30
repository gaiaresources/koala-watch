import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CensusPage } from './census';

@NgModule({
  declarations: [
    CensusPage,
  ],
  imports: [
    IonicPageModule.forChild(CensusPage),
  ],
})
export class CensusPageModule {}
