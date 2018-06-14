import { RecordsListComponent } from './records-list/records-list';
import { RecordsMapComponent } from './records-map/records-map';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RecordFormComponent } from './record-form/record-form';
import { SharedModule } from '../shared/shared.module';
import { KlmSatCensusComponent } from "./klm-sat-census/klm-sat-census";

@NgModule({
    declarations: [
        RecordsListComponent,
        RecordsMapComponent,
        RecordFormComponent,
        KlmSatCensusComponent
    ],
    imports: [
        IonicModule,
        SharedModule
    ],
    entryComponents: [
        RecordsListComponent,
        RecordsMapComponent,
        KlmSatCensusComponent
    ],
    exports: [
        RecordsListComponent,
        RecordsMapComponent,
        RecordFormComponent,
        KlmSatCensusComponent
    ]
})
export class ComponentsModule {
}
