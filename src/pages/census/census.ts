import { Component, ViewChild } from '@angular/core';

import { AlertController, FabContainer, IonicPage, NavController, NavParams } from 'ionic-angular';

import { UUID } from 'angular2-uuid';
import * as moment from 'moment/moment';

import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { ObservationPage } from '../observation/observation';
import { StorageService } from '../../shared/services/storage.service';
import { RecordFormComponent } from '../../components/record-form/record-form';
import { PhotoGalleryComponent } from '../../components/photo-gallery/photo-gallery';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';

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
    public isNewRecord = true;
    public readonly = false;

    public segmentContent = 'form';
    public dataset: Dataset;

    private record: ClientRecord;
    private recordClientId: string;

    @ViewChild(RecordFormComponent)
    private recordForm: RecordFormComponent;

    @ViewChild(PhotoGalleryComponent)
    private photoGallery: PhotoGalleryComponent;

    constructor(public censusNavCtrl: NavController,
                public navParams: NavParams,
                private storageService: StorageService,
                private alertController: AlertController) {
    }

    public onClickedNewRecord(datasetName: string, fabContainer: FabContainer) {
        this.censusNavCtrl.push('ObservationPage', {
            datasetName: datasetName,
            parentId: this.recordClientId
        });
    }

    public ionViewWillEnter() {
        this.recordClientId = this.navParams.get('recordClientId');
        this.isNewRecord = !this.recordClientId;
        if (this.isNewRecord) {
            this.recordClientId = UUID.UUID();
        }
        this.photoGallery.RecordId = this.recordClientId;

        // just during dev
        const datasetName = this.navParams.get('datasetName') || 'KLM-SAT Census';

        this.storageService.getDataset(datasetName).subscribe((dataset: Dataset) => {
            this.dataset = dataset;

            if (!this.isNewRecord) {
                // if this is an existing record, set form values from data
                this.storageService.getRecord(this.recordClientId).subscribe(
                    record => {
                        if (record) {
                            this.record = record;
                            this.recordForm.value = record.data;
                            this.photoGallery.PhotoIds = record.photoIds;
                            this.readonly = !!record.id;
                        }
                    }
                );
            }
        });

        if (this.recordClientId) {
            while (this.observationRecords.length) {
                this.observationRecords.pop();
            }
            this.storageService.getChildRecords(this.recordClientId).subscribe(
                (record: ClientRecord) => this.observationRecords.push(record)
            );
        }
    }

    public save() {
        const formValues: object = this.recordForm.value;

        this.storageService.putRecord({
            valid: this.recordForm.valid && this.observationRecords.reduce((acc, cur) => cur.valid && acc, true),
            client_id: this.recordClientId,
            dataset: this.dataset.id,
            datasetName: this.navParams.get('datasetName'),
            datetime: this.recordForm.dateFieldKey ? formValues[this.recordForm.dateFieldKey] : moment().format(),
            data: formValues,
            count: this.observationRecords.length,
            photoIds: this.photoGallery.PhotoIds
        }).subscribe((result: boolean) => {
            if (result) {
                this.censusNavCtrl.pop();
            }
        });
    }

    public delete() {
        this.alertController.create({
            title: 'Census',
            message: 'Are you sure you want to delete this census?',
            enableBackdropDismiss: true,
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        if (this.record) {
                            this.photoGallery.rollback();
                            this.storageService.deleteRecord(this.record.client_id).subscribe(deleted => {
                                if (this.record.photoIds) {
                                    from(this.record.photoIds).pipe(
                                        mergeMap(photoId => this.storageService.deletePhoto(photoId))
                                    ).subscribe();
                                }
                                this.censusNavCtrl.pop();
                            }, (error) => {
                                this.alertController.create({
                                    title: 'Cannot Delete',
                                    message: 'Sorry, cannot delete this observation.',
                                    enableBackdropDismiss: true,
                                    buttons: [
                                        {
                                            text: 'OK',
                                            handler: () => {}
                                        }
                                    ]
                                }).present();

                            });
                        } else {
                            this.censusNavCtrl.pop();
                        }
                    }
                },
                {
                    text: 'No'
                }]
        }).present();
    }
}
