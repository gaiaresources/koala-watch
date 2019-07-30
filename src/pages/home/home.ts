import { Component, OnInit, ViewChild } from '@angular/core';
import {
    Events,
    IonicPage,
    Loading,
    LoadingController,
    NavController,
    NavParams,
    Tabs,
    ToastController
} from 'ionic-angular';

import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { APIError } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { RecordsListComponent } from '../../components/records-list/records-list';
import { RecordsMapComponent } from '../../components/records-map/records-map';
import { UploadService } from '../../shared/services/upload.service';
import {
    DATASET_NAME_CENSUS,
    DATASET_NAME_OBSERVATION,
    TOAST_DURATION
} from '../../shared/utils/consts';
import { isDatasetCensus } from '../../shared/utils/functions';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    public showList = true;

    public records: ClientRecord[];

    private loading?: Loading;

    public recordsList = RecordsListComponent;
    public recordsMap = RecordsMapComponent;

    // consts used in template
    public DATASETNAME_CENSUS = DATASET_NAME_CENSUS;
    public DATASETNAME_OBSERVATION = DATASET_NAME_OBSERVATION;

    @ViewChild('homeTabs') tabRef: Tabs;

    @ViewChild('myFabUpload') fabUpload: any;

    public isMapTabSelected = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
                private toastCtrl: ToastController, private storageService: StorageService,
                private uploadService: UploadService, private event: Events) {
        this.records = [];
    }

    ionViewWillEnter() {
        this.loadRecords();
        this.event.publish('home-willenter');
        this.event.subscribe('upload-clicked', () => this.clickedUpload());
    }

    public clickedUpload() {
        if (this.records.length <= 0) {
            // Disable this button if there are no records to prevent an issue
            // where the spinner remains indefinitely.
            return;
        }
        this.loading = this.loadingCtrl.create({
            content: 'Uploading records'
        });
        this.loading.present();
        this.uploadService.uploadValidRecords().subscribe({
            error: (error: APIError) => {
                this.loading.dismiss();

                this.toastCtrl.create({
                    message: `Some records failed to upload: ${error.msg}`,
                    duration: TOAST_DURATION,
                    cssClass: 'toast-message'
                }).present();

                this.uploadService.uploadPendingRecordPhotos().subscribe();
                this.loadRecords();
            },
            complete: () => {
                this.loading.dismiss();
                this.toastCtrl.create({
                    message: 'Records uploaded successfully',
                    duration: TOAST_DURATION,
                    cssClass: 'toast-message'
                }).present();

                this.uploadService.uploadPendingRecordPhotos().subscribe();
                this.loadRecords();
            }
        });
    }

    public onClickedNewRecord(datasetName: string) {
        const page = isDatasetCensus(datasetName) ? 'CensusPage' : 'ObservationPage';
        this.navCtrl.push(page, {datasetName: datasetName});
    }

    public setMapTabSelected(value: boolean) {
        this.isMapTabSelected = value;
    }

    private loadRecords() {
        while (this.records.length) {
            this.records.pop();
        }
        this.storageService.getSetting('hideUploaded').subscribe( hideUploaded => {
            if (JSON.parse(hideUploaded)) {
                this.storageService.getParentRecords().filter(record => !(!!record.id)).subscribe(
                    (record: ClientRecord) => this.records.push(record));
            } else {
                this.storageService.getParentRecords().subscribe(
                    (record: ClientRecord) => this.records.push(record));
            }
        });

    }

  ngOnInit(): void {
      setTimeout( () => {
        // These are needed to fix the app when used with a screenreader. Otherwise,
        // ionic adds a close-icon, which manifests itself as the screenreader saying
        // Close <title of button> button.
        let fabUp = document.getElementById('myFabUpload');
        let fabUpIn = fabUp.children.item(0);
        let fabStuff = fabUpIn.children;
        let fabDelete = fabStuff.namedItem('close');
        if (fabDelete) {
          fabDelete.remove();
        }
        fabUp = document.getElementById('myFabObo');
        fabUpIn = fabUp.children.item(0);
        fabStuff = fabUpIn.children;
        fabDelete = fabStuff.namedItem('close');
        if (fabDelete) {
          fabDelete.remove();
        }
        fabUp = document.getElementById('myFabTree');
        fabUpIn = fabUp.children.item(0);
        fabStuff = fabUpIn.children;
        fabDelete = fabStuff.namedItem('close');
        if (fabDelete) {
          fabDelete.remove();
        }
      }, 500);
  }
}
