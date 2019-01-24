import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CensusPage } from './census';
import { ComponentsModule } from '../../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faSave } from '@fortawesome/free-regular-svg-icons';

@NgModule({
    declarations: [
        CensusPage,
    ],
    imports: [
        IonicPageModule.forChild(CensusPage),
        ComponentsModule,
        FontAwesomeModule
    ],
    entryComponents: [
        CensusPage
    ]
})
export class CensusPageModule {
    constructor() {
        library.add(faTrashAlt, faSave);
    }
}
