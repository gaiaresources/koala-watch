import { FabContainer, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { APIService } from '../../biosys-core/services/api.service';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public showList: boolean = true;

    public records: ClientRecord[];

    constructor(public navCtrl: NavController, public navParams: NavParams, private storageService: StorageService,
                private apiService: APIService) {
    }

    public ionViewWillEnter() {
        this.records = [];
        this.storageService.getAllRecords().subscribe(
            (record: ClientRecord) => this.records.push(record)
        );
    }

    public clickedUpload() {
        // refactor to use flatmap once server handling clientId
        this.storageService.getAllValidRecords().subscribe(
            (clientRecords: ClientRecord[]) => clientRecords.map((clientRecord: ClientRecord) => {
                let clientId = clientRecord.clientId;
                this.apiService.createRecord(clientRecord).subscribe(
                    () => this.storageService.deleteRecord(clientId).subscribe(() => {
                        this.records = [];
                        this.storageService.getAllRecords().subscribe((record: ClientRecord) => this.records.push(record));
                    })
                );
            })
        );
    }

    public clickedNew(datasetName: number, fabContainer: FabContainer) {
        this.navCtrl.push('ObservationPage', {datasetName: datasetName});
        fabContainer.close();
    }
}
