import { FabContainer, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { Record } from '../../biosys-core/interfaces/api.interfaces';
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
    public showList: boolean = true;
    public uploading: boolean = false;

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
        this.uploading = true;

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
            error: () => this.uploading = false,
            complete: () => {
                this.uploading = false;
                this.records = [];
                this.storageService.getAllRecords().subscribe(
                    (record: ClientRecord) => this.records.push(record)
                );
            }
        });
    }

    public clickedNew(datasetName: number, fabContainer: FabContainer) {
        this.navCtrl.push('ObservationPage', {datasetName: datasetName});
        fabContainer.close();
    }
}
