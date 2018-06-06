import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { filter, flatMap } from 'rxjs/operators';

import { Geolocation } from '@ionic-native/geolocation';
import { SchemaService } from '../../biosys-core/services/schema.service';
import { FieldDescriptor, ObservationFormDescriptor } from '../../biosys-core/interfaces/form.interfaces';
import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
    selector: 'page-observation',
    templateUrl: 'observation.html',
    providers: [SchemaService]
})
export class ObservationPage {
    public showForm: boolean = true;
    public form: FormGroup;
    public formDescriptor: ObservationFormDescriptor;

    private showLeavingAlertMessage: boolean = true;
    private record: ClientRecord;
    private dataset: Dataset;

    constructor(private navCtrl: NavController, private navParams: NavParams,
                private schemaService: SchemaService, private storageService: StorageService,
                private geolocation: Geolocation, private alertController: AlertController) {
        if (!this.navParams.get('datasetName')) {
            this.showLeavingAlertMessage = false;
            this.navCtrl.pop();
        }

        this.storageService.getDataset(this.navParams.get('datasetName')).pipe(
            flatMap((dataset: Dataset) => {
                this.dataset = dataset;
                return this.schemaService.getFormDescriptorAndGroupFromDataset(dataset);
            })
        ).subscribe((results) => {
            this.formDescriptor = results[0] as ObservationFormDescriptor;

            this.form = results[1];

            let recordClientId = this.navParams.get('recordClientId');

            if (recordClientId) {
                // set form values from data
                this.storageService.getRecord(recordClientId).subscribe(
                    record => {
                        this.record = record;
                        this.form.setValue(record.data);
                    }
                );
            } else {
                // patch in default form values
                this.geolocation.watchPosition().pipe(
                    filter(position => !!position['coords']) // filter out errors
                ).subscribe(position => {
                    if (this.form.contains('Latitude')) {
                        this.form.patchValue({'Latitude': position.coords.latitude});
                    }

                    if (this.form.contains('Longitude')) {
                        this.form.patchValue({'Longitude': position.coords.longitude});
                    }

                    if (this.form.contains('Accuracy')) {
                        this.form.patchValue({'Accuracy': position.coords.accuracy});
                    }
                });

                if (this.form.contains('First Date')) {
                    this.form.patchValue({'First Date': new Date().toISOString()});
                }

                this.formDescriptor.hiddenFields.map((field: FieldDescriptor) =>
                    this.form.controls[field.key].setValue(field.defaultValue)
                );
            }
        });
    }

    public ionViewCanLeave() {
        if (this.showLeavingAlertMessage) {
            this.alertController.create({
                title: 'Leaving observation unsaved',
                message: 'You are leaving the observation unsaved, are you sure?',
                enableBackdropDismiss: true,
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            this.showLeavingAlertMessage = false;
                            this.navCtrl.pop();
                        }
                    },
                    {
                        text: 'No'
                    }]
            }).present();

            return false;
        }
    }

    public save() {
        this.storageService.putRecord({
            valid: this.form.valid,
            client_id: !!this.record ? this.record.client_id : UUID.UUID(),
            dataset: this.dataset.id,
            datasetName: this.navParams.get('datasetName'),
            datetime: new Date().toISOString(),
            data: this.form.value
        }).subscribe((result: boolean) => {
            if (result) {
                this.showLeavingAlertMessage = false;
                this.navCtrl.pop();
            }
        });
    }
}
