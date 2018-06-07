import { FabContainer, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { APIService } from '../../biosys-core/services/api.service';
import { RecordsMapComponent } from "../../components/records-map/records-map";
import { RecordsListComponent } from "../../components/records-list/records-list";
import { LineString, MultiLineString, MultiPolygon, Point, Polygon } from "geojson";

class FooBoo implements ClientRecord {
    clientId: string;
    created: string;
    data: { [p: string]: any } | null;
    dataset: number;
    datasetName: string;
    datetime: string;
    geometry: Point | LineString | MultiLineString | Polygon | MultiPolygon | null;
    id: number;
    last_modified: string;
    name_id: number;
    site: number | null;
    source_info: { [p: string]: string | number };
    species_name: string;
    valid: boolean;
}

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public showList: boolean = true;

    public recordsList = RecordsListComponent;
    public recordsMap = RecordsMapComponent;

    public records: ClientRecord[];

    constructor(public navCtrl: NavController, public navParams: NavParams, private storageService: StorageService,
                private apiService: APIService) {
        this.records = [];
    }

    public ionViewWillEnter() {
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
                        while(this.records.length)
                            this.records.pop();
                        this.storageService.getAllRecords().subscribe((record: ClientRecord) => this.records.push(record));
                    })
                );
            })
        );
    }

    public clickedNewOppObs(fabContainer: FabContainer, theThing: RecordsMapComponent) {
        this.navCtrl.push('ObservationPage', {datasetName: 'Koala Opportunistic Observation'});
        fabContainer.close();
    }
    
    public clickedNewSat(fabContainer: FabContainer, theThing: RecordsMapComponent) {
        this.navCtrl.push('CensusPage');
        fabContainer.close();
    }
    
    public clickedAdd(theThing: any) {
    }
}
