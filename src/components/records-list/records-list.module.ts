import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import {RecordsListComponent} from "./records-list";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
    {
        path: '',
        component: RecordsListComponent
    }
];

@NgModule({
    declarations: [RecordsListComponent],
    exports: [
        RecordsListComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class RecordListModule {}
