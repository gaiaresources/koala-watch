import { RecordsListComponent } from './records-list/records-list';
import { RecordsMapComponent } from './records-map/records-map';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RecordFormComponent } from './record-form/record-form';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [
        RecordsListComponent,
        RecordsMapComponent,
        RecordFormComponent
    ],
    imports: [
        IonicModule,
        SharedModule
    ],
    entryComponents: [
        RecordsListComponent,
        RecordsMapComponent
    ],
    exports: [
        RecordsListComponent,
        RecordsMapComponent,
        RecordFormComponent
    ]
})
export class ComponentsModule {
}
