import { Component, ViewChild } from '@angular/core';

import { AlertController, NavController, NavParams } from '@ionic/angular';

import { UUID } from 'angular2-uuid';
import moment from 'moment/moment';
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { RecordFormComponent } from '../../components/record-form/record-form';
import { PhotoGalleryComponent } from '../../components/photo-gallery/photo-gallery';

import { DATASET_NAME_TREESURVEY } from '../../shared/utils/consts';

import { FormNavigationRecord, ActiveRecordService } from '../../providers/activerecordservice/active-record.service';

/**
 * Generated class for the CensusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    public recordClientId: string;

    @ViewChild(RecordFormComponent)
    public recordForm: RecordFormComponent;

    @ViewChild(PhotoGalleryComponent)
    private photoGallery: PhotoGalleryComponent;

    public DATASETNAME_TREESURVEY = DATASET_NAME_TREESURVEY;

    private siteNumberOriginal = '';

    constructor(public censusNavCtrl: NavController,
                public navParams: NavParams,
                private storageService: StorageService,
                private alertController: AlertController,
                public activeRecordService: ActiveRecordService) {
    }

    public onClickedNewRecord(datasetName: string) {
        this.willEnterChildRecord();

        const payload = {
            datasetName: datasetName,
            parentId: this.recordClientId
        }

        this.censusNavCtrl.navigateForward('ObservationPage', {
            state: payload
        });
    }

    public onClickedNewPhoto(useCamera: boolean) {
      this.photoGallery.onClickedNewPhoto(useCamera);
    }

    public ionViewWillEnter() {
        if (!this.recordClientId) {
            this.recordClientId = this.navParams.get('recordClientId');
        }

        this.isNewRecord = !this.recordClientId;
        this.activeRecordService.isNewRecord = this.isNewRecord;
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

    public ionViewDidLeave() {
      this.activeRecordService.setLatestCoords(null);
    }

    public ionViewCanLeave() {
      if (this.readonly) {
        return true;
      }

      if (this.activeRecordService.getGoingToMap()) {
        this.save(false);
        return true;
      } else if (this.showLeavingAlertMessage) {
            this.alertController.create({
                header: 'Leaving census unsaved',
                message: 'You are leaving the census form data unsaved, are you sure?',
                backdropDismiss: true,
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            this.photoGallery.rollback();
                            this.showLeavingAlertMessage = false;
                            // TODO test
                            this.censusNavCtrl.navigateRoot('/home')
                            //this.censusNavCtrl.popToRoot();
                        }
                    },
                    {
                        text: 'No'
                    }]
            }).then((alert) => alert.present());

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

    private updateFromMap() {
      const mapCoords = this.activeRecordService.getLatestCoords();

        if (mapCoords) {
          const valuesToPatch = {};
          valuesToPatch['Latitude'] = mapCoords.lat.toFixed(6);
          valuesToPatch['Longitude'] = mapCoords.lng.toFixed(6);

          // reset as they are not present in map coords
          valuesToPatch['Accuracy'] = null;
          valuesToPatch['Altitude'] = null;

          this.recordForm.value = valuesToPatch;
        }
    }

    public save(popForm = false) {
        const formValues: object = this.recordForm.value;

        if (this.activeRecordService.getGoingToMap()) {
          this.activeRecordService.setActiveFormNavigationRecord({
            page: 'CensusPage',
            params: {
              datasetName: this.navParams.get('datasetName'),
              recordClientId: this.recordClientId,
              readonly: false
            }
          } as FormNavigationRecord);
        }
        this.activeRecordService.setGoingToMap(false); // reset as "not going to map"


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
                // TODO test
                this.censusNavCtrl.navigateRoot('/home')
                //this.censusNavCtrl.popToRoot();
            }

            if (result) {
              if (formValues['SiteNo'] !== this.siteNumberOriginal) {
                // alert('changed');
                for (const obo of this.observationRecords) {
                  obo.data!['SiteNo'] = formValues['SiteNo'];
                  this.storageService.putRecord(obo);
                }
              }
            }
        });
    }

    public delete() {
        this.alertController.create({
            header: 'Census',
            message: 'Are you sure you want to delete this census?',
            backdropDismiss: true,
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        if (this.record) {
                            this.photoGallery.rollback();
                            this.storageService.deleteRecord(this.record.client_id!).subscribe(deleted => {
                                if (this.record.photoIds) {
                                    from(this.record.photoIds).pipe(
                                        mergeMap(photoId => this.storageService.deletePhoto(photoId))
                                    ).subscribe();
                                }
                                // TODO: Delete any child records
                                this.showLeavingAlertMessage = false;
                                // TODO Test
                                this.censusNavCtrl.navigateRoot('/home')
                                //this.censusNavCtrl.popToRoot();
                            }, (error) => {
                                this.alertController.create({
                                    header: 'Cannot Delete',
                                    message: 'Sorry, cannot delete this observation.',
                                    backdropDismiss: true,
                                    buttons: [
                                        {
                                            text: 'OK',
                                            handler: () => {}
                                        }
                                    ]
                                }).then((alert) => alert.present());

                            });
                        } else {
                            this.showLeavingAlertMessage = false;
                            // TODO test
                            this.censusNavCtrl.navigateRoot('/home')
                            //this.censusNavCtrl.popToRoot();
                        }
                    }
                },
                {
                    text: 'No'
                }]
        }).then((alert) => alert.present());
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
                    this.siteNumberOriginal = record.data!['SiteNo'];
                    this.updateFromMap();
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
                if (this.record.data!.hasOwnProperty('End Date and time') && this.observationRecords.length) {
                    this.record.data!['End Date and time'] = this.observationRecords.slice(-1)[0].datetime;
                }

                this.recordForm.value = this.record.data!;
                this.updateFromMap();

                this.recordForm.validate();
            }
        });
    }
}
