import { RecordsListComponent } from './records-list/records-list';
import { RecordsMapComponent } from './records-map/records-map';
import { IonicModule } from "ionic-angular";
import { NgModule } from "@angular/core";

@NgModule({
    declarations: [
        RecordsListComponent,
        RecordsMapComponent,
    ],
    imports: [
        IonicModule
    ],
    entryComponents: [
        RecordsListComponent,
        RecordsMapComponent,
    ],
    exports: [
        RecordsListComponent,
        RecordsMapComponent,
    ]
})
export class ComponentsModule {
}
