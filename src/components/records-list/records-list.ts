import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { ANY_ANGULAR_DATETIME_FORMAT } from '../../biosys-core/utils/consts';
import { RECORD_INCOMPLETE, RECORD_COMPLETE, RECORD_UPLOADED, DATASET_NAME_OBSERVATION, DATASET_NAME_CENSUS,
    DATASET_NAME_TREESIGHTING } from '../../shared/utils/consts';
import { isDatasetCensus } from '../../shared/utils/functions';
import { StorageService } from '../../shared/services/storage.service';

@Component({
    selector: 'records-list',
    templateUrl: 'records-list.html'
})

export class RecordsListComponent {
    public angularDateFormat: string = ANY_ANGULAR_DATETIME_FORMAT;
    public items: Array<{ title: string, note: string, icon: string }>;

    // consts used in template
    public DATASETNAME_TREESIGHTING = DATASET_NAME_TREESIGHTING;
    public DATASETNAME_CENSUS = DATASET_NAME_CENSUS;
    public DATASETNAME_OBSERVATION = DATASET_NAME_OBSERVATION;

    @Input()
    public records: ClientRecord[];

    @Input()
    public showLegend = true;

    @Input()
    public baseNavController: NavController;

    @Input()
    public parentId: string;

    @Input()
    public showObservation = true;

    @Input()
    public showCensus = true;

    @Input()
    public showTree = true;

    @Input()
    public showUpload = false;

    @Input()
    public showWelcome = true;

    @Output()
    public enteringRecord = new EventEmitter();

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: StorageService,
                private events: Events) {
        this.baseNavController = (this.navParams.data.hasOwnProperty('navCtrl') ? this.navParams.get('navCtrl') : undefined);
        this.records = (this.navParams.data.hasOwnProperty('data') ? this.navParams.get('data') : []);
        if (this.navParams.data.hasOwnProperty('showTree')) {
            this.showTree = this.navParams.get('showTree');
        }
        if (this.navParams.data.hasOwnProperty('showCensus')) {
            this.showCensus = this.navParams.get('showCensus');
        }
        if (this.navParams.data.hasOwnProperty('showObservation')) {
            this.showObservation = this.navParams.get('showObservation');
        }
        if (this.navParams.data.hasOwnProperty('showUpload')) {
            this.showUpload = this.navParams.get('showUpload');
        }
        if (this.navParams.data.hasOwnProperty('showLegend')) {
            this.showLegend = this.navParams.get('showLegend');
        }
    }

    public getStatusColor(record: ClientRecord) {
        if (record.id) {
            return RECORD_UPLOADED;
        }
        return record.valid ? RECORD_COMPLETE : RECORD_INCOMPLETE;
    }

    public getDatasetIcon(record: ClientRecord): string {
        switch (record.datasetName) {
            case DATASET_NAME_OBSERVATION:
                return 'assets/imgs/eye.png';
            case DATASET_NAME_CENSUS:
                return 'assets/imgs/poop.png';
            case DATASET_NAME_TREESIGHTING:
                return 'assets/imgs/tree.png';
        }
    }

    public getCountIcon(record: ClientRecord): string {
        switch (record.datasetName) {
            case DATASET_NAME_OBSERVATION:
                return 'assets/imgs/koala.png';
            case DATASET_NAME_CENSUS:
                return 'assets/imgs/tree.png';
            case DATASET_NAME_TREESIGHTING:
                return 'assets/imgs/koala.png';
        }
    }

    private navPush(page, params) {
        this.enteringRecord.emit();

        if (!this.baseNavController) {
            this.navCtrl.push(page, params);
        } else {
            this.baseNavController.push(page, params);
        }
    }

    public itemTapped(event, record) {
        const page = isDatasetCensus(record.datasetName) ? 'CensusPage' : 'ObservationPage';
        const params = {
            datasetName: record.datasetName,
            recordClientId: record.client_id,
            parentId: record.parentId
        };
        this.navPush(page, params);
    }

    public onClickedNewRecord(datasetName: string) {
        let page;
        const params = {
            datasetName: datasetName,
        };
        if (isDatasetCensus(datasetName)) {
            page = 'CensusPage';
        } else {
            if (this.parentId) {
                params['parentId'] = this.parentId;
            }
            page = 'ObservationPage';
        }
        this.navPush(page, params);
    }

    public uploadClicked() {
        this.events.publish('upload-clicked');
    }
}
