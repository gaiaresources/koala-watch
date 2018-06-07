import {
    FabContainer,
    IonicPage,
    Loading,
    LoadingController,
    NavController,
    NavParams,
    ToastController
} from 'ionic-angular';
import { Component } from '@angular/core';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { APIError, Record } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { APIService } from '../../biosys-core/services/api.service';
import { mergeMap } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';


@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public static readonly MESSAGE_DURATION = 3000;

    public showList: boolean = true;

    public records: ClientRecord[];

    private loading: Loading;

    constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
                private toastCtrl: ToastController, private storageService: StorageService,
                private apiService: APIService) {
        this.loading = this.loadingCtrl.create({
            content: 'Uploading records'
        });
    }

    ionViewWillEnter() {
        this.loadRecords();
    }

    public clickedUpload() {
        this.loading.present();

        // take all valid records, one-by-one create them on the server and after they've been successfully created,
        // delete from storage. One all records are created, refresh the records list.
        this.storageService.getAllValidRecords().pipe(
            mergeMap((clientRecords: ClientRecord[]) =>
                from(clientRecords).pipe(
                    mergeMap( (clientRecord: ClientRecord) =>
                        this.apiService.createRecord(clientRecord).pipe(
                            mergeMap((record: Record) => this.storageService.deleteRecord(record.client_id))
                        )
                    )
                )
            )
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

    public clickedNew(datasetName: number, fabContainer: FabContainer) {
        this.navCtrl.push('ObservationPage', {datasetName: datasetName});
        fabContainer.close();
    }

    private loadRecords() {
        this.records = [];
        this.storageService.getAllRecords().subscribe(
            (record: ClientRecord) => this.records.push(record)
        );
    }
}
