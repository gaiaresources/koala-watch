import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { filter, mergeMap } from 'rxjs/operators';

import { Geolocation } from '@ionic-native/geolocation';
import { SchemaService } from '../../biosys-core/services/schema.service';
import { FieldDescriptor, FormDescriptor } from '../../biosys-core/interfaces/form.interfaces';
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
    public formDescriptor: FormDescriptor;

    private showLeavingAlertMessage: boolean = true;
    private record: ClientRecord;
    private datasetId: number;

    constructor(private navCtrl: NavController, private navParams: NavParams,
                private schemaService: SchemaService, private storageService: StorageService,
                private geolocation: Geolocation, private alertController: AlertController) {
        this.storageService.getDataset(this.navParams.get('datasetName')).pipe(
            mergeMap((dataset: Dataset) => {
                this.datasetId = dataset.id;
                return this.schemaService.getFormDescriptorAndGroupFromDataPackage(dataset);
            })
        ).subscribe((results) => {
            this.formDescriptor = results[0];
            this.form = results[1];

            let recordClientId = this.navParams.get('recordClientId');

            if (recordClientId) {
                this.storageService.getRecord(recordClientId).subscribe(
                    record => {
                        this.record = record;
                        this.form.setValue(record.data);
                    }
                );
            } else {
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

                // patch in all single-value enum fields
                this.formDescriptor.fields.forEach((field: FieldDescriptor) => {
                    if (field.type === 'select' && field.options.length === 1) {
                        // for some reason patching straight into the form (this.form.patchValue) doesn't work,
                        // possibly because the form hasn't rendered yet so options aren't available. This work-around
                        // from https://stackoverflow.com/questions/48514515/value-not-rendering-in-textarea-using-patch
                        // value?rq=1 seems to work
                        this.form.controls[field.key].patchValue(field.options[0]);
                    }
                });
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
            clientId: !!this.record ? this.record.clientId : UUID.UUID(),
            dataset: this.datasetId,
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
