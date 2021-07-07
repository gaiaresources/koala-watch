import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { AlertController, Events, IonicPage, Navbar, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment/moment';

import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { RecordFormComponent } from '../../components/record-form/record-form';
import { PhotoGalleryComponent } from '../../components/photo-gallery/photo-gallery';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';

import { FormNavigationRecord, ActiveRecordService } from '../../providers/activerecordservice/active-record.service';

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

  @ViewChild('ion-navbar', { read: ElementRef }) private navBar: Navbar;

  private eventNeedMapHandler = (pos) => {
      this.showLeavingAlertMessage = false;
      this.navCtrl.push('mcp', pos);
    }

  constructor(private navCtrl: NavController, private navParams: NavParams,
              private storageService: StorageService,
              private alertController: AlertController,
              private events: Events,
              public activeRecordService: ActiveRecordService) {
  }

  public onClickedNewPhoto(useCamera: boolean) {
    this.photoGallery.onClickedNewPhoto(useCamera);
  }

  public ionViewWillEnter() {
    this.events.subscribe('map-needmap', this.eventNeedMapHandler);
    if (this.navParams.data.hasOwnProperty('parentId')) {
      this.parentId = this.navParams.get('parentId');
    }

    this.recordClientId = this.navParams.get('recordClientId');
    this.readonly = this.navParams.get('readonly');
    this.isNewRecord = !this.recordClientId;
    this.activeRecordService.isNewRecord = this.isNewRecord;
    if (this.isNewRecord) {
      this.recordClientId = UUID.UUID();
    }
    this.photoGallery.RecordId = this.recordClientId;

    this.storageService.getDataset(this.navParams.get('datasetName')).subscribe((dataset: Dataset) => {
      if (dataset) {
        this.dataset = dataset;

        if (this.recordClientId && !this.isNewRecord) {
          // if this is an existing record, set form values from data
          this.storageService.getRecord(this.recordClientId).subscribe(
            record => {
              if (record) {
                this.record = record;
                this.recordForm.value = record.data;
                this.updateFromMap();
                this.recordForm.validate();
                this.photoGallery.PhotoIds = record.photoIds;
                this.readonly = !!record.id || this.navParams.get('readonly');

                this.storageService.getRecord(this.parentId).subscribe(
                  parentRecord => {
                    if (parentRecord) {
                      if (parentRecord.data['SiteNo'] !== record.data['SiteNo']) {
                        // changed
                        record.data['SiteNo'] = parentRecord.data['SiteNo'];
                        this.recordForm.value['SiteNo'] = record.data['SiteNo'];

                        this.updateFromMap();
                        this.save(true);
                      }
                    }
                  });
              }
            });
        } else if (this.parentId) {
          // if this is a new record and there is a parent, patch in values common with parent field
          this.storageService.getRecord(this.parentId).subscribe(
            record => {
              if (record) {
                this.recordForm.value = record.data;

                this.updateFromMap();
              }
            }
          );
        }
      }
    });
  }

  public ionViewDidLeave() {
    this.activeRecordService.setLatestCoords(null);
  }

  public ionViewCanLeave() {
    this.events.unsubscribe('map-needmap', this.eventNeedMapHandler);
    if (this.readonly) {
      return true;
    }

    if (this.activeRecordService.getGoingToMap()) {
      this.save(true);
      return true;
    } else if (this.showLeavingAlertMessage) {
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
              this.navCtrl.popToRoot();
            }
          },
          {
            text: 'No',
            handler: () => {
              // this.events.unsubscribe('map-needmap', this.eventNeedMapHandler);
            }
          }]
      }).present();

      return false;
    } else {
      return true;
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

  public save(dontQuit: boolean = false) {
    this.photoGallery.commit();
    const formValues: object = this.recordForm.value;

    let count;
    if (formValues.hasOwnProperty('Count')) {
      count = formValues['Count'];
    } else if (formValues.hasOwnProperty('Koala #')) {
      count = formValues['Koala #'];
    } else if (formValues.hasOwnProperty('Koala count')) {
      count = formValues['Koala count'];
    }

    // special case for species code
    if (formValues.hasOwnProperty('SpeciesCode')) {
      try {
        const speciesCodeFD = this.recordForm.getFieldDescriptor('SpeciesCode');
        const scientificNameFD = this.recordForm.getFieldDescriptor('ScientificName');
        const scientificNameValue = formValues['ScientificName'];

        // species code will be the equivalent option as species name (same index)
        for (let i = 0, len = scientificNameFD.options.length; i < len; i++) {
          if (scientificNameFD.options[i].value === scientificNameValue) {
            formValues['SpeciesCode'] = speciesCodeFD.options[i].value;
            this.recordForm.value = formValues;
            break;
          }
        }
      } catch (err) {
        // fail silently
      }
    }

    if (this.activeRecordService.getGoingToMap()) {
      this.activeRecordService.setActiveFormNavigationRecord({
        page: 'ObservationPage',
        params: {
          datasetName: this.navParams.get('datasetName'),
          recordClientId: this.recordClientId,
          parentId: this.parentId,
          readonly: false
        }
      } as FormNavigationRecord);
    }
    this.activeRecordService.setGoingToMap(false); // reset as "not going to map"

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
      if (!dontQuit && result) {
        this.showLeavingAlertMessage = false;
        this.navCtrl.popToRoot();
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
                this.navCtrl.popToRoot();
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
              this.navCtrl.popToRoot();
            }
          }
        },
        {
          text: 'No'
        }]
    }).present();
  }
}
