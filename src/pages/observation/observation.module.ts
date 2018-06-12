import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ObservationPage } from './observation';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        ObservationPage,
    ],
    imports: [
        IonicPageModule.forChild(ObservationPage),
        ComponentsModule
    ],
})
export class ObservationPageModule {
}
