import { NgModule } from '@angular/core';

import {IonicModule, NavController, NavParams} from '@ionic/angular';
import { RecordFormComponent } from './record-form/record-form';
import { SharedModule } from '../shared/shared.module';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar as farStar, faCalendar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import {CommonModule, DatePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MbscModule} from "@mobiscroll/angular";
import {StorageService} from "../shared/services/storage.service";
import {ActiveRecordService} from "../providers/activerecordservice/active-record.service";
import {SchemaService} from "../biosys-core/services/schema.service";


@NgModule({
    declarations: [
        RecordFormComponent,
        PhotoGalleryComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        FontAwesomeModule,
        DatePipe,
        MbscModule,
    ],
    exports: [
        RecordFormComponent,
        PhotoGalleryComponent
    ],
    providers: [
        NavController,
        NavParams,
        StorageService,
        SchemaService,
        ActiveRecordService
    ]
})
export class ComponentsModule {
    constructor() {
        library.add(faCalendar, faLocationArrow, fasStar, farStar);
    }
}
