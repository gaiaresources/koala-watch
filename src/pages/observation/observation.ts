import { Component } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { filter, mergeMap } from 'rxjs/operators';

import * as moment from 'moment/moment';

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

    private dateFieldKey: string;

    constructor(private navCtrl: NavController, private navParams: NavParams,
                private schemaService: SchemaService, private storageService: StorageService,
                private geolocation: Geolocation, private alertController: AlertController) {
        if (!this.navParams.get('datasetName')) {
            this.showLeavingAlertMessage = false;
            this.navCtrl.pop();
        }

        this.storageService.getDataset(this.navParams.get('datasetName')).pipe(
            mergeMap((dataset: Dataset) => {
                this.dataset = dataset;
                return this.schemaService.getFormDescriptorAndGroupFromDataset(dataset);
            })
        ).subscribe((results) => {
            this.formDescriptor = results[0] as ObservationFormDescriptor;

            this.form = results[1];

            if (this.formDescriptor.dateFields) {
                // use whatever is the first date field as the representative date field
                this.dateFieldKey = this.formDescriptor.dateFields[0].key;
            }

            let recordClientId = this.navParams.get('recordClientId');

            if (recordClientId) {
                // if this is an existing record, set form values from data
                this.storageService.getRecord(recordClientId).subscribe(
                    record => {
                        this.record = record;
                        this.form.setValue(record.data);

                        // need to show validation errors where appropriate for incomplete record
                        if (this.form.invalid) {
                            Object.keys(this.form.controls).forEach((fieldName: string) =>
                                this.form.get(fieldName).markAsDirty());
                        }
                    }
                );
            } else {
                // if this is a new record, patch in default form values where appropriate
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

                if (this.dateFieldKey) {
                    // moment().format() will return the current date/time in local timezone
                    this.form.controls[this.dateFieldKey].setValue(moment().format());
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
            datetime: this.dateFieldKey ? this.form.value[this.dateFieldKey] : moment().format(),
            data: this.form.value,
            count: !!this.form.value['Count'] ? this.form.value['Count'] : 0
        }).subscribe((result: boolean) => {
            if (result) {
                this.showLeavingAlertMessage = false;
                this.navCtrl.pop();
            }
        });
    }

    public getFieldError(fieldDescriptor: FieldDescriptor): string {
        if (!this.form.controls[fieldDescriptor.key].errors) {
            return '';
        }

        const errors: ValidationErrors = this.form.controls[fieldDescriptor.key].errors;
        const errorKey = Object.keys(errors)[0];
        const error = errors[errorKey];

        switch (errorKey) {
            case 'required':
                return 'This field is required';
            case 'min':
                return `Minimum value: ${error['min']}`;
            case 'max':
                return `Maximum value: ${error['max']}`;
            case 'minLength':
                return `Minimum length: ${error['minLength']}`;
            case 'maxLength':
                return `Maximum length: ${error['maxLength']}`;
            case 'pattern':
                return `Must match pattern: ${error['pattern']}`;
        }
    }
}
