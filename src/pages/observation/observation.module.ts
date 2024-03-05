import { NgModule } from '@angular/core';
import {AlertController, IonicModule, NavController, NavParams} from '@ionic/angular';
import { ObservationPage } from './observation';
import { ComponentsModule } from '../../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faSave } from '@fortawesome/free-regular-svg-icons';
import {BiosysCoreModule} from "../../biosys-core/biosys-core.module";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {StorageService} from "../../shared/services/storage.service";
import {ActiveRecordService} from "../../providers/activerecordservice/active-record.service";
import {EventService} from "../../shared/services/event.service";

const routes: Routes = [
  {
    path: '',
    component: ObservationPage
  }
]

@NgModule({
    declarations: [
        ObservationPage,
    ],
    imports: [
        IonicModule,
        ComponentsModule,
        FontAwesomeModule,
        BiosysCoreModule,
        RouterModule.forChild(routes),
        FormsModule
    ],
    providers: [
        NavController,
        NavParams,
        StorageService,
        AlertController,
        ActiveRecordService,
        EventService
    ]
})
export class ObservationPageModule {
    constructor() {
        library.add(faTrashAlt, faSave);
    }
}
