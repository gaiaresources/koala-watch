import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from "../../shared/services/storage.service";
import { Dataset } from "../../biosys-core/interfaces/api.interfaces";
import { RecordFormComponent } from "../record-form/record-form";
import { APIService } from "../../biosys-core/services/api.service";

/**
 * Generated class for the KlmSatCensusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'klm-sat-census',
    templateUrl: 'klm-sat-census.html',
})

export class KlmSatCensusComponent {
    public dataset: Dataset;
    @ViewChild(RecordFormComponent)
    private recordForm: RecordFormComponent;
    
    constructor(private storageService: StorageService,
                private apiService: APIService,
                public navCtrl: NavController,
                public navParams: NavParams, private events: Events) {
        // find the dataset schema and load if necessary:
        this.storageService.getDataset(this.navParams.get('datasetName')).subscribe((dataset) => {
            if (dataset == undefined) {
                this.apiService.getDatasets().subscribe((datasetApi: Dataset[]) => {
                    for (let dataset of datasetApi) {
                        if (dataset.name == this.navParams.get('datasetName')) {
                            this.dataset = dataset;
                            this.storageService.putDataset(dataset);
                        }
                    }
                }, (error) => {
                    alert('Error Contacting Server: (DS) ' + error.msg);
                });
            }
            else {
                this.dataset = dataset;
            }
        });
    
        // TODO: this may be refactored post-demo
        // Subscribe to an event that requests the form data...
        this.events.subscribe('form:get', () => {
            this.events.publish('form:put', this.recordForm);
        })
    
        // load in the previous record data where appropriate:
        if (this.navParams.data.hasOwnProperty('parent')) {
            // if this is an existing record, set form values from data
            this.storageService.getRecord(this.navParams.get('parent')).subscribe(
                record => {
                    this.recordForm.value = record.data;
                }
            );
        }
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad KlmSatCensusPage');
    }
}
