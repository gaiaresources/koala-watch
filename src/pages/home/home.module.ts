import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { ComponentsModule } from "../../components/components.module";
import { ObservationPageModule } from "../observation/observation.module";

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        ComponentsModule,
        ObservationPageModule
    ],
})
export class HomePageModule {}
