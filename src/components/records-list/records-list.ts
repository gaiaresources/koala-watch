import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { ANY_ANGULAR_DATETIME_FORMAT } from '../../biosys-core/utils/consts';
import {
  RECORD_INCOMPLETE, RECORD_COMPLETE, RECORD_UPLOADED, DATASET_NAME_OBSERVATION, DATASET_NAME_CENSUS,
  DATASET_NAME_TREESURVEY, APP_NAME
} from '../../shared/utils/consts';
import { isDatasetCensus } from '../../shared/utils/functions';
import { StorageService } from '../../shared/services/storage.service';
import '../../shared/utils/consts';

@Component({
    selector: 'records-list',
    templateUrl: 'records-list.html'
})

export class RecordsListComponent {
    public angularDateFormat: string = ANY_ANGULAR_DATETIME_FORMAT;
    public items: Array<{ title: string, note: string, icon: string }>;

    // consts used in template
    public DATASETNAME_TREESURVEY = DATASET_NAME_TREESURVEY;
    public DATASETNAME_CENSUS = DATASET_NAME_CENSUS;
    public DATASETNAME_OBSERVATION = DATASET_NAME_OBSERVATION;

    public APP_NAME = APP_NAME;

    @Input()
    public records: ClientRecord[];


    @Input()
    public baseNavController: NavController;

    @Input()
    public parentId: string;

    @Input()
    public showHowto = true;

    @Input()
    public showLegend = true;

    @Input()
    public readonly = false;

    @Output()
    public enteringRecord = new EventEmitter();

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: StorageService,
                private events: Events) {
        this.baseNavController = (this.navParams.data.hasOwnProperty('navCtrl') ? this.navParams.get('navCtrl') : undefined);

        this.records = (this.navParams.data.hasOwnProperty('data') ? this.navParams.get('data') : []);

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

  public getAltText(record: ClientRecord): string {
    let rv = '';
    switch (record.datasetName) {
      case DATASET_NAME_OBSERVATION:
        rv = 'Observation ';
        break;
      case DATASET_NAME_CENSUS:
        rv = 'Census ';
        break;
      case DATASET_NAME_TREESURVEY:
        rv = 'Tree Survey ';
        break;
    }
    if (record.id) {
      rv += 'uploaded';
    } else {
      rv += record.valid ? 'complete but not uploaded' : 'incomplete';
    }
    return rv;
  }


  public getDatasetIcon(record: ClientRecord): string {
        switch (record.datasetName) {
            case DATASET_NAME_OBSERVATION:
                return 'assets/imgs/eye.png';
            case DATASET_NAME_CENSUS:
                return 'assets/imgs/trees.png';
            case DATASET_NAME_TREESURVEY:
                return 'assets/imgs/tree.png';
        }
    }

    public getCountIcon(record: ClientRecord): string {
        switch (record.datasetName) {
            case DATASET_NAME_OBSERVATION:
                return 'assets/imgs/koala.png';
            case DATASET_NAME_CENSUS:
                return 'assets/imgs/tree.png';
            case DATASET_NAME_TREESURVEY:
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
            parentId: record.parentId,
            readonly: this.readonly
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
