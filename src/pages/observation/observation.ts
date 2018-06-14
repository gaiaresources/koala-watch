import { Component, ViewChild } from '@angular/core';

import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import * as moment from 'moment/moment';

import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { UUID } from 'angular2-uuid';
import { RecordFormComponent } from '../../components/record-form/record-form';
import { APIService } from "../../biosys-core/services/api.service";

@IonicPage()
@Component({
    selector: 'page-observation',
    templateUrl: 'observation.html'
})
export class ObservationPage {
    public showForm: boolean = true;
    public isNewRecord: boolean = true;

    @ViewChild(RecordFormComponent)
    private recordForm: RecordFormComponent;

    private showLeavingAlertMessage: boolean = true;
    private record: ClientRecord;
    private dataset: Dataset;

    constructor(private navCtrl: NavController,
                private navParams: NavParams,
                private storageService: StorageService,
                private apiService: APIService,
                private alertController: AlertController) {
        if (!this.navParams.get('datasetName')) {
            this.showLeavingAlertMessage = false;
            this.navCtrl.pop();
        }

        let recordClientId = this.navParams.get('recordClientId');
        this.isNewRecord = !recordClientId;

        this.storageService.getDataset(this.navParams.get('datasetName')).subscribe((dataset: Dataset) => {
            if (dataset != null) {
                this.dataset = dataset;
    
                if (recordClientId) {
                    // if this is an existing record, set form values from data
                    this.storageService.getRecord(recordClientId).subscribe(
                        record => {
                            this.record = record;
                            this.recordForm.value = record.data;
                        }
                    );
                }
            }
            else {
                this.apiService.getDatasets().subscribe( (datasets: Dataset[]) => {
                    for (let dataset of datasets) {
                        if (dataset.name == this.navParams.get('datasetName')) {
                            this.dataset = dataset;
                            this.storageService.putDataset(dataset);
                        }
                    }
                }, (error) => {
                    alert('Error ' + error.msg);
                })
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
        let parent_id = this.navParams.get('parent'); // FIXME: TONY PARENT_ID IS HERE

        this.storageService.putRecord({
            valid: this.recordForm.valid,
            client_id: !!this.record ? this.record.client_id : UUID.UUID(),
            dataset: this.dataset.id,
            datasetName: this.navParams.get('datasetName'),
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
