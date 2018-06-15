import { Component, ViewChild } from '@angular/core';

import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { UUID } from 'angular2-uuid';
import * as moment from 'moment/moment';

import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { RecordFormComponent } from '../../components/record-form/record-form';

@IonicPage()
@Component({
    selector: 'page-observation',
    templateUrl: 'observation.html'
})
export class ObservationPage {
    public showForm: boolean = true;
    public isNewRecord: boolean = true;
    public parentId: string;

    @ViewChild(RecordFormComponent)
    private recordForm: RecordFormComponent;

    private showLeavingAlertMessage: boolean = true;
    private record: ClientRecord;
    private dataset: Dataset;

    constructor(private navCtrl: NavController, private navParams: NavParams, private storageService: StorageService,
                private alertController: AlertController) {
    }

    public ionViewDidEnter() {
        let recordClientId = this.navParams.get('recordClientId');
        this.isNewRecord = !recordClientId;

        this.parentId = this.navParams.get('parentId');

        this.storageService.getDataset(this.navParams.get('datasetName')).subscribe((dataset: Dataset) => {
            this.dataset = dataset;

            if (recordClientId) {
                // if this is an existing record, set form values from data
                this.storageService.getRecord(recordClientId).subscribe(
                    record => {
                        this.record = record;
                        console.log(this.recordForm);
                        this.recordForm.value = record.data;
                    }
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
        const formValues: object = this.recordForm.value;

        this.storageService.putRecord({
            valid: this.recordForm.valid,
            client_id: !!this.record ? this.record.client_id : UUID.UUID(),
            dataset: this.dataset.id,
            datasetName: this.navParams.get('datasetName'),
            parentId: this.parentId,
            datetime: this.recordForm.dateFieldKey ? formValues[this.recordForm.dateFieldKey] : moment().format(),
            data: formValues,
            count: !!formValues['Count'] ? formValues['Count'] : 0
        }).subscribe((result: boolean) => {
            if (result) {
                this.showLeavingAlertMessage = false;
                this.navCtrl.pop();
            }
        });
    }
}
