import { Component, ViewChild } from '@angular/core';
import {
    Events,
    FabContainer,
    IonicPage,
    Loading,
    LoadingController,
    NavController,
    NavParams, Tabs,
    ToastController
} from 'ionic-angular';

import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { APIError, Record } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { mergeMap } from 'rxjs/operators';
import { RecordsListComponent } from '../../components/records-list/records-list';
import { RecordsMapComponent } from '../../components/records-map/records-map';
import { UploadService } from '../../shared/services/upload.service';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public static readonly MESSAGE_DURATION = 3000;

    public showList = true;

    public records: ClientRecord[];

    private loading: Loading;

    public recordsList = RecordsListComponent;
    public recordsMap = RecordsMapComponent;

    @ViewChild('homeTabs') tabRef: Tabs;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
                private toastCtrl: ToastController, private storageService: StorageService,
                private uploadService: UploadService) {
        this.records = [];
        this.loading = this.loadingCtrl.create({
            content: 'Uploading records'
        });
    }

    ionViewWillEnter() {
        this.loadRecords();
        this.tabRef.select(0);
    }

    public clickedUpload() {
        this.loading.present();
        this.uploadService.uploadValidRecords().pipe(
            mergeMap(([clientRecord, record]: [ClientRecord, Record]) =>
                this.uploadService.uploadRecordPhotos(record, clientRecord.photoIds))
        ).subscribe({
            error: (error: APIError) => {
                this.loading.dismiss();

                this.toastCtrl.create({
                    message: `Some records failed to upload: ${error.msg}`,
                    duration: HomePage.MESSAGE_DURATION,
                    cssClass: 'toast-message'
                }).present();

                this.loadRecords();
            },
            complete: () => {
                this.loading.dismiss();
                this.toastCtrl.create({
                    message: 'Records uploaded successfully',
                    duration: HomePage.MESSAGE_DURATION,
                    cssClass: 'toast-message'
                }).present();

                this.loadRecords();
            }
        });
    }

    public onClickedNewRecord(datasetName: string) {
        const page = datasetName.toLowerCase().indexOf('census') > -1 ? 'CensusPage' : 'ObservationPage';
        this.navCtrl.push(page, {datasetName: datasetName});
    }

    private loadRecords() {
        while (this.records.length) {
            this.records.pop();
        }
        this.storageService.getParentRecords().subscribe((record: ClientRecord) => this.records.push(record));
    }
}
