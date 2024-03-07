import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import {RecordsMapComponent} from "./records-map";

const routes: Routes = [
    {
        path: '',
        component: RecordsMapComponent
    }
];

@NgModule({
    declarations: [RecordsMapComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild(routes)
    ]
})
export class RecordsMapModule {}
