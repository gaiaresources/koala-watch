import {Component, Input} from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import {
    APP_NAME,
    DATASET_NAME_CENSUS,
    DATASET_NAME_OBSERVATION,
    DATASET_NAME_TREESURVEY,
    UPDATE_BUTTON_NAME
} from '../../shared/utils/consts';
import {isDatasetCensus} from "../../shared/utils/functions";
import {EventService} from "../../shared/services/event.service";

/**
 * Generated class for the HelpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-help',
    templateUrl: 'help.html',
    styleUrls: ['help.scss']
})
export class HelpPage {

    public DATASETNAME_TREESURVEY = DATASET_NAME_TREESURVEY;
    public DATASETNAME_CENSUS = DATASET_NAME_CENSUS;
    public DATASETNAME_OBSERVATION = DATASET_NAME_OBSERVATION;

    public APP_NAME = APP_NAME;
    public UPDATE_BUTTON_NAME = UPDATE_BUTTON_NAME;

    @Input()
    public parentId: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private events: EventService) {
    }

    public onClickedNewRecord(datasetName: string) {
        const params: { datasetName: string; parentId: string | null} = {
            datasetName: datasetName,
            parentId: null
        };

        if (this.parentId) {
            params['parentId'] = this.parentId;
        }

        let page = isDatasetCensus(datasetName) ? '/census' : '/observation';

        this.navCtrl.navigateForward(page, { state: params })
    }

    public uploadClicked() {
        this.events.publishEvent('upload-clicked');
    }
}
