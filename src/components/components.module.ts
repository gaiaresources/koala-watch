import { RecordsListComponent } from './records-list/records-list';
import { RecordsMapComponent } from './records-map/records-map';
import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { MbscModule } from '@mobiscroll/angular';
import { RecordFormComponent } from './record-form/record-form';
import { SharedModule } from '../shared/shared.module';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery';

@NgModule({
    declarations: [
        RecordsListComponent,
        RecordsMapComponent,
        RecordFormComponent,
        PhotoGalleryComponent
    ],
    imports: [
        IonicModule,
        MbscModule,
        SharedModule
    ],
    entryComponents: [
        RecordsListComponent,
        RecordsMapComponent
    ],
    exports: [
        RecordsListComponent,
        RecordsMapComponent,
        RecordFormComponent,
        PhotoGalleryComponent
    ]
})
export class ComponentsModule {
}
