import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CensusPage } from './census';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
    declarations: [
        CensusPage,
    ],
    imports: [
        IonicPageModule.forChild(CensusPage),
        ComponentsModule
    ],
    entryComponents: [
        CensusPage
    ]
})
export class CensusPageModule {}
