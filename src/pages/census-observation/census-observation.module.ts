import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComponentsModule } from "../../components/components.module";
import { CensusObservationPage } from "./census-observation";

@NgModule({
    declarations: [
        CensusObservationPage,
    ],
    imports: [
        IonicPageModule.forChild(CensusObservationPage),
        ComponentsModule
    ],
    entryComponents: [
        CensusObservationPage
    ]
})
export class CensusObservationModule {}
