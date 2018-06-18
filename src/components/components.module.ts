import { RecordsListComponent } from './records-list/records-list';
import { RecordsMapComponent } from './records-map/records-map';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { RecordFormComponent } from './record-form/record-form';
import { SharedModule } from '../shared/shared.module';
import { KlmSatCensusComponent } from "./klm-sat-census/klm-sat-census";
import { PhotoGalleryComponent } from "./photo-gallery/photo-gallery";

@NgModule({
    declarations: [
        RecordsListComponent,
        RecordsMapComponent,
        RecordFormComponent,
        KlmSatCensusComponent,
        PhotoGalleryComponent,
    ],
    imports: [
        IonicModule,
        SharedModule
    ],
    entryComponents: [
        RecordsListComponent,
        RecordsMapComponent,
        KlmSatCensusComponent,
        RecordsMapComponent,
    ],
    exports: [
        RecordsListComponent,
        RecordsMapComponent,
        RecordFormComponent,
        KlmSatCensusComponent,
        PhotoGalleryComponent,
    ]
})
export class ComponentsModule {
}
