import { NgModule } from '@angular/core';

import { MbscModule } from '@mobiscroll/angular';

import { RecordsListComponent } from './records-list/records-list';
import { RecordsMapComponent } from './records-map/records-map';
import { IonicModule } from 'ionic-angular';
import { RecordFormComponent } from './record-form/record-form';
import { SharedModule } from '../shared/shared.module';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar as farStar, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
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
        SharedModule,
        FontAwesomeModule
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
    constructor() {
        library.add(faCalendar, faLocationArrow, fasStar, farStar);
    }
}
