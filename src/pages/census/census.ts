import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientRecord } from "../../shared/interfaces/mobile.interfaces";
import { CensusObservationPage } from "./census-observation/census-observation";
import { RecordsListComponent } from "../../components/records-list/records-list";
import { KlmSatCensusComponent } from "../../components/klm-sat-census/klm-sat-census";
import { ObservationPage } from "../observation/observation";
import { StorageService } from "../../shared/services/storage.service";
import { UUID } from "angular2-uuid";
import { RecordFormComponent } from "../../components/record-form/record-form";
import * as moment from 'moment/moment';
import { Dataset, Record } from "../../biosys-core/interfaces/api.interfaces";

/**
 * Generated class for the CensusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-census',
    templateUrl: 'census.html',
})
export class CensusPage {
    public observations: ClientRecord[];
    public showOboAdd: boolean = false;
    public observationsList = RecordsListComponent;
    public klmSatCensus = KlmSatCensusComponent;
    private dsName = 'KLM-SAT Tree Sighting';
    public sightingUuid: string;
    private dataset: Dataset;
    
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: StorageService, private events: Events) {
        this.observations = new Array();
        if (this.navParams.data.hasOwnProperty('isNew') && this.navParams.get('isNew')===true)
            this.sightingUuid = UUID.UUID();
        else
            this.sightingUuid = this.navParams.get('recordClientId');
        this.storage.getDataset('KLM-SAT Census').subscribe( (ds) => {
            if (ds)
                this.dataset = ds;
        })
        
        // TODO: refactor to use segments?
        this.events.subscribe('form:put', (recordForm: RecordFormComponent) => {
            this.saveToStorage(recordForm);
        })
    }
    
    public ionViewDidLoad() {
        console.log('ionViewDidLoad CensusPage');
    }
    
    public addSatObo() {
        this.navCtrl.push('ObservationPage', {
            'datasetName': this.dsName,
            'parent': this.sightingUuid,
        });
    }
    
    public ionViewWillEnter() {
        // FIXME: this will need refactoring later once the design settles a bit more
        while (this.observations.length > 0)
            this.observations.pop();
        this.storage.getAllRecords().subscribe((record: ClientRecord) => {
            if (record.datasetName === this.dsName)
            // if (record.parent_id === this.sightingUuid)
            // FIXME: change this once the parentID manifestation is agreed to
                this.observations.push(record);
        });
    }
    
    public save() {
        console.log('save clicked');
        this.events.publish('form:get');
    }
    
    public saveToStorage(recordForm: RecordFormComponent) {
        this.storage.putRecord({
            valid: recordForm.valid,
            client_id: this.sightingUuid,
            dataset: this.dataset.id,
            datasetName: this.dsName,
            datetime: recordForm.dateFieldKey ? recordForm.value[recordForm.dateFieldKey] : moment().format(),
            data: recordForm.value,
            count: this.observations.length,
        }).subscribe((result: boolean) => {
            if (result) {
                this.navCtrl.pop();
            }
        }, (err) => {
            alert(err.msg);
        });
    }
}
