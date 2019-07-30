import { Component, ViewChild } from '@angular/core';

import { AlertController, FabContainer, IonicPage, NavController, NavParams } from 'ionic-angular';

import { UUID } from 'angular2-uuid';
import * as moment from 'moment/moment';
import { from } from 'rxjs/observable/from';
import { map, mergeMap } from 'rxjs/operators';

import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { ObservationPage } from '../observation/observation';
import { StorageService } from '../../shared/services/storage.service';
import { RecordFormComponent } from '../../components/record-form/record-form';
import { PhotoGalleryComponent } from '../../components/photo-gallery/photo-gallery';

import { DATASET_NAME_TREESURVEY } from '../../shared/utils/consts';

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

    private showLeavingAlertMessage = true;
    private record: ClientRecord;
    private recordClientId: string;

    @ViewChild(RecordFormComponent)
    private recordForm: RecordFormComponent;

    @ViewChild(PhotoGalleryComponent)
    private photoGallery: PhotoGalleryComponent;

    public DATASETNAME_TREESURVEY = DATASET_NAME_TREESURVEY;

    private siteNumberOriginal = '';

    constructor(public censusNavCtrl: NavController,
                public navParams: NavParams,
                private storageService: StorageService,
                private alertController: AlertController) {
    }

    public onClickedNewRecord(datasetName: string, fabContainer: FabContainer) {
        this.willEnterChildRecord();

        this.censusNavCtrl.push('ObservationPage', {
            datasetName: datasetName,
            parentId: this.recordClientId
        });
    }

    public onClickedNewPhoto() {
        this.photoGallery.onClickedNewPhoto();
    }

    public ionViewWillEnter() {
        if (!this.recordClientId) {
            this.recordClientId = this.navParams.get('recordClientId');
        }

        this.isNewRecord = !this.recordClientId;
        if (this.isNewRecord) {
            this.recordClientId = UUID.UUID();
        }
        this.photoGallery.RecordId = this.recordClientId;

        if (!this.dataset) {
            const datasetName = this.navParams.get('datasetName');

            this.storageService.getDataset(datasetName).subscribe((dataset: Dataset) => {
                this.dataset = dataset;

                if (this.isNewRecord) {
                    this.recordForm.value = {'Census ID': this.recordClientId};
                } else {
                    this.loadRecordAndChildRecords();
                }
            });
        } else {
            this.loadRecordAndChildRecords();
        }

        this.showLeavingAlertMessage = true;
    }

    public ionViewCanLeave() {
      if (this.readonly) {
        return true;
      }

        if (this.showLeavingAlertMessage) {
            this.alertController.create({
                title: 'Leaving census unsaved',
                message: 'You are leaving the census form data unsaved, are you sure?',
                enableBackdropDismiss: true,
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            this.photoGallery.rollback();
                            this.showLeavingAlertMessage = false;
                            this.censusNavCtrl.pop();
                        }
                    },
                    {
                        text: 'No'
                    }]
            }).present();

            return false;
        } else {
            return true;
        }
    }

    public willEnterChildRecord() {
        this.showLeavingAlertMessage = false;
        if (!this.readonly) {
          this.save();
        }
    }

    public save(popForm = false) {
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
            if (result && popForm) {
                this.showLeavingAlertMessage = false;
                this.censusNavCtrl.pop();
            }

            if (result) {
              if (formValues['SiteNo'] !== this.siteNumberOriginal) {
                // alert('changed');
                for (const obo of this.observationRecords) {
                  obo.data['SiteNo'] = formValues['SiteNo'];
                  this.storageService.putRecord(obo);
                }
              }
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
                                // TODO: Delete any child records
                                this.showLeavingAlertMessage = false;
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
                            this.showLeavingAlertMessage = false;
                            this.censusNavCtrl.pop();
                        }
                    }
                },
                {
                    text: 'No'
                }]
        }).present();
    }

    private loadRecordAndChildRecords() {
        while (this.observationRecords.length) {
            this.observationRecords.pop();
        }

        this.storageService.getRecord(this.recordClientId).pipe(
            map((record: ClientRecord) => {
                if (record) {
                    this.record = record;
                    this.photoGallery.PhotoIds = record.photoIds;
                    this.readonly = !!record.id;
                    this.siteNumberOriginal = record.data['SiteNo'];
                }
            }),
            mergeMap(() => this.storageService.getChildRecords(this.recordClientId)),
            map((childRecord: ClientRecord) => this.observationRecords.push(childRecord))
        )
        .subscribe({
            complete: () => {
                // sort records by datetime
                this.observationRecords.sort((a: ClientRecord, b: ClientRecord) => {
                    const aDate = new Date(a.datetime);
                    const bDate = new Date(b.datetime);

                    return aDate > bDate ? 1 : aDate < bDate ? -1 : 0;
                });

                // patch in end datetime as the datetime of the last child element
                if (this.record.data.hasOwnProperty('End Date and time') && this.observationRecords.length) {
                    this.record.data['End Date and time'] = this.observationRecords.slice(-1)[0].datetime;
                }

                this.recordForm.value = this.record.data;

                this.recordForm.validate();
            }
        });
    }
}
