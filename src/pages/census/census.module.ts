import { NgModule } from '@angular/core';
import {AlertController, IonicModule, NavController, NavParams} from '@ionic/angular';
import { CensusPage } from './census';
import { ComponentsModule } from '../../components/components.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faSave } from '@fortawesome/free-regular-svg-icons';
import {BiosysCoreModule} from "../../biosys-core/biosys-core.module";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {StorageService} from "../../shared/services/storage.service";
import {ActiveRecordService} from "../../providers/activerecordservice/active-record.service";
import {RecordListModule} from "../../components/records-list/records-list.module";

const routes: Routes = [
  {
    path: '',
    component: CensusPage
  }
]

@NgModule({
    declarations: [
        CensusPage,
    ],
    imports: [
        IonicModule,
        ComponentsModule,
        FontAwesomeModule,
        BiosysCoreModule,
        RouterModule.forChild(routes),
        FormsModule,
        RecordListModule
    ],
    providers: [
        NavController,
        NavParams,
        StorageService,
        AlertController,
        ActiveRecordService
    ]
})

export class CensusPageModule {
    constructor() {
        library.add(faTrashAlt, faSave);
    }
}
