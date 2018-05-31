import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { filter, flatMap } from 'rxjs/operators';

import { SchemaService } from '../../biosys-core/services/schema.service';
import { FormDescriptor } from '../../biosys-core/interfaces/form.interfaces';
import { APIService } from '../../biosys-core/services/api.service';
import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';

@IonicPage()
@Component({
    selector: 'page-observation',
    templateUrl: 'observation.html',
    providers: [SchemaService]
})
export class ObservationPage {
    public showForm: boolean = true;
    public form: FormGroup;
    public formDescriptor: FormDescriptor;

    constructor(private navCtrl: NavController, private navParams: NavParams, private apiService: APIService,
                private schemaService: SchemaService, private storageService: StorageService,
                private geolocation: Geolocation) {
        this.apiService.getDatasetById(this.navParams.get('datasetId')).pipe(
            flatMap((dataset: Dataset) => this.schemaService.getFormDescriptorAndGroupFromDataPackage(dataset))
        ).subscribe((results) => {
            this.formDescriptor = results[0];
            this.form = results[1];

            this.geolocation.watchPosition().pipe(
                filter(position => !!position['coords']) // filter out errors
            ).subscribe(position => {
                if (this.form.contains('Latitude')) {
                    this.form.patchValue({'Latitude': position.coords.latitude});
                }

                if (this.form.contains('Longitude')) {
                    this.form.patchValue({'Longitude': position.coords.longitude});
                }
            });
        });
    }

    public save() {
        this.storageService.putRecord({
            data: this.form.value
        }).subscribe((result: boolean) => {
            if (result) {
                this.navCtrl.pop();
            }
        });
    }
}
