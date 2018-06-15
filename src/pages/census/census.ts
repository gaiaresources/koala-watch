import { Component, ViewChild } from '@angular/core';

import { AlertController, Events, FabContainer, IonicPage, NavController, NavParams } from 'ionic-angular';

import { UUID } from 'angular2-uuid';
import * as moment from 'moment/moment';

import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { ObservationPage } from '../observation/observation';
import { StorageService } from '../../shared/services/storage.service';
import { RecordFormComponent } from '../../components/record-form/record-form';


/**
 * Generated class for the CensusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-census',
    templateUrl: 'census.html',
})
export class CensusPage {
    public observationRecords: ClientRecord[] = [];
    public isNewRecord: boolean = true;

    public segmentContent = 'form';
    public dataset: Dataset;
    public recordClientId: string;

    private record: ClientRecord;

    @ViewChild(RecordFormComponent)
    private recordForm: RecordFormComponent;

    constructor(public navCtrl: NavController, public navParams: NavParams, private storageService: StorageService) {
        this.recordClientId = this.navParams.get('recordClientId');
        this.isNewRecord = !this.recordClientId;

        // just during dev
        const datasetName = this.navParams.get('datasetName') || 'KLM-SAT Census';

        this.storageService.getDataset(datasetName).subscribe((dataset: Dataset) => {
            this.dataset = dataset;

            if (this.recordClientId) {
                // if this is an existing record, set form values from data
                this.storageService.getRecord(this.recordClientId).subscribe(
                    record => {
                        this.record = record;
                        this.recordForm.value = record.data;
                    }
                );
            } else {
                this.recordClientId = UUID.UUID();
            }
        });
    }

    public onClickedNewRecord(datasetName: string, fabContainer: FabContainer) {
        this.navCtrl.push('ObservationPage', {
            datasetName: datasetName,
            parentId: this.recordClientId
        });
    }

    public ionViewWillEnter() {
        if (this.recordClientId) {
            this.observationRecords = [];
            this.storageService.getChildRecords(this.recordClientId).subscribe(
                (record: ClientRecord) => this.observationRecords.push(record)
            );
        }
    }

    public save() {
        const formValues: object = this.recordForm.value;

        this.storageService.putRecord({
            valid: this.recordForm.valid && this.observationRecords.reduce((acc, cur) => cur.valid && acc, true),
            client_id: !!this.record ? this.record.client_id : UUID.UUID(),
            dataset: this.dataset.id,
            datasetName: this.navParams.get('datasetName'),
            datetime: this.recordForm.dateFieldKey ? formValues[this.recordForm.dateFieldKey] : moment().format(),
            data: formValues,
            count: this.observationRecords.length
        }).subscribe((result: boolean) => {
            if (result) {
                this.navCtrl.pop();
            }
        });
    }
}
