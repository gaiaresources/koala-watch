import { Component, ViewChild } from '@angular/core';

import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment/moment';

import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { RecordFormComponent } from '../../components/record-form/record-form';
import { APIService } from '../../biosys-core/services/api.service';
import { PhotoGalleryComponent } from '../../components/photo-gallery/photo-gallery';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
    selector: 'page-observation',
    templateUrl: 'observation.html'
})
export class ObservationPage {
    public showForm = true;
    public isNewRecord = true;
    public parentId: string;
    public readonly = false;

    @ViewChild(RecordFormComponent)
    private recordForm: RecordFormComponent;

    @ViewChild(PhotoGalleryComponent)
    private photoGallery: PhotoGalleryComponent;

    private showLeavingAlertMessage = true;
    private record: ClientRecord;
    private dataset: Dataset;
    private recordClientId: string;

    constructor(private navCtrl: NavController, private navParams: NavParams, private storageService: StorageService,
                private alertController: AlertController, private apiService: APIService) {
    }

    public ionViewWillEnter() {
        if (!this.navParams.get('datasetName')) {
            this.showLeavingAlertMessage = false;
            this.navCtrl.pop();
        }

        if (this.navParams.data.hasOwnProperty('parentId')) {
            this.parentId = this.navParams.get('parentId');
        }

        this.recordClientId = this.navParams.get('recordClientId');
        this.isNewRecord = !this.recordClientId;
        if (this.isNewRecord) {
            this.recordClientId = UUID.UUID();
        }
        this.photoGallery.RecordId = this.recordClientId;

        this.storageService.getDataset(this.navParams.get('datasetName')).subscribe((dataset: Dataset) => {
            if (dataset) {
                this.dataset = dataset;

                if (this.recordClientId) {
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
                            this.photoGallery.rollback();
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
        this.photoGallery.commit();
        const formValues: object = this.recordForm.value;

        const count = !!formValues['Count'] ? formValues['Count'] : !!formValues['Koala #'] ? formValues['Koala #'] : 0;

        this.storageService.putRecord({
            valid: this.recordForm.valid,
            client_id: this.recordClientId,
            dataset: this.dataset.id,
            datasetName: this.navParams.get('datasetName'),
            parentId: this.parentId,
            datetime: this.recordForm.dateFieldKey ? formValues[this.recordForm.dateFieldKey] : moment().format(),
            data: formValues,
            count: count,
            photoIds: this.photoGallery.PhotoIds
        }).subscribe((result: boolean) => {
            if (result) {
                this.showLeavingAlertMessage = false;
                this.navCtrl.pop();
            }
        });
    }

    public delete() {
        this.alertController.create({
            title: 'Observation',
            message: 'Are you sure you want to delete this observation?',
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
                                this.showLeavingAlertMessage = false;
                                this.navCtrl.pop();
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
                            this.showLeavingAlertMessage = false;
                            this.navCtrl.pop();
                        }
                    }
                },
                {
                    text: 'No'
                }]
        }).present();
    }
}
