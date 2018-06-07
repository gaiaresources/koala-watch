import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationPage } from './observation';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [
        ObservationPage,
    ],
    imports: [
        IonicPageModule.forChild(ObservationPage),
        SharedModule
    ],
})
export class ObservationPageModule {
}
