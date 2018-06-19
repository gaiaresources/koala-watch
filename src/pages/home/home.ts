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
import { RecordsListComponent } from "../../components/records-list/records-list";
import { RecordsMapComponent } from "../../components/records-map/records-map";

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
    
    public recordsList = RecordsListComponent;
    public recordsMap = RecordsMapComponent;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
                private toastCtrl: ToastController, private storageService: StorageService,
                private apiService: APIService) {
        this.records = [];
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
            mergeMap((clientRecord: ClientRecord) =>
                this.apiService.createRecord(clientRecord).pipe(
                    mergeMap((record: Record) => this.storageService.deleteRecord(record.client_id))
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
    
    public onClickedNewRecord(datasetName: string, fabContainer: FabContainer) {
        const page = datasetName.toLowerCase().indexOf('census') > -1 ? 'CensusPage' : 'ObservationPage';
        this.navCtrl.push(page, {datasetName: datasetName});
    }
    
    private loadRecords() {
        this.storageService.getParentRecords().subscribe(
            (record: ClientRecord) => {
                this.records.push(record)
            });
    }
}
