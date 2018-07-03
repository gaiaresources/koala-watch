import { Component, ViewChild } from '@angular/core';
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
    DATASETNAME_CENSUS,
    DATASETNAME_OBSERVATION,
    DATASETNAME_TREESIGHTING,
    isDatasetCensus
} from '../../shared/utils/consts';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public static readonly MESSAGE_DURATION = 3000;

    public showList = true;

    public records: ClientRecord[];

    private loading?: Loading;

    public recordsList = RecordsListComponent;
    public recordsMap = RecordsMapComponent;

    public DATASETNAME_TREESIGHTING = DATASETNAME_TREESIGHTING;
    public DATASETNAME_CENSUS = DATASETNAME_CENSUS;
    public DATASETNAME_OBSERVATION = DATASETNAME_OBSERVATION;

    @ViewChild('homeTabs') tabRef: Tabs;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
                private toastCtrl: ToastController, private storageService: StorageService,
                private uploadService: UploadService, private event: Events) {
        this.records = [];
    }

    ionViewWillEnter() {
        this.loadRecords();
        this.event.publish('home-willenter');
    }

    public clickedUpload() {
        this.loading = this.loadingCtrl.create({
            content: 'Uploading records'
        });
        this.loading.present();
        this.uploadService.uploadValidRecords().subscribe({
            error: (error: APIError) => {
                this.loading.dismiss();

                this.toastCtrl.create({
                    message: `Some records failed to upload: ${error.msg}`,
                    duration: HomePage.MESSAGE_DURATION,
                    cssClass: 'toast-message'
                }).present();

                this.uploadService.uploadPendingRecordPhotos().subscribe();
                this.loadRecords();
            },
            complete: () => {
                this.loading.dismiss();
                this.toastCtrl.create({
                    message: 'Records uploaded successfully',
                    duration: HomePage.MESSAGE_DURATION,
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

    private loadRecords() {
        while (this.records.length) {
            this.records.pop();
        }
        this.storageService.getParentRecords().subscribe((record: ClientRecord) => this.records.push(record));
    }
}
