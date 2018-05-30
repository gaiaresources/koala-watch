import { NgModule } from '@angular/core';
import { RecordsListComponent } from './records-list/records-list';
import { RecordsMapComponent } from './records-map/records-map';

@NgModule({
    declarations: [
        RecordsListComponent,
        RecordsMapComponent,
    ],
    imports: [],
    exports: [
        RecordsListComponent,
        RecordsMapComponent,
    ]
})
export class ComponentsModule {
}
