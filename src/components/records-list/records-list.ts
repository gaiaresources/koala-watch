import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { ANY_ANGULAR_DATETIME_FORMAT } from '../../biosys-core/utils/consts';

@Component({
    selector: 'records-list',
    templateUrl: 'records-list.html'
})
export class RecordsListComponent {
    public angularDateFormat: string = ANY_ANGULAR_DATETIME_FORMAT;
    public items: Array<{ title: string, note: string, icon: string }>;

    @Input()
    public records: ClientRecord[];

    @Input()
    public showLegend = true;

    @Input()
    public baseNavController: NavController;

    @Input()
    public parentId: string;

    @Input()
    public haveObservation = true;

    @Input()
    public haveCensus = true;

    @Input()
    public haveTree = true;

    @Input()
    public haveWelcome = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams) {
        this.baseNavController = (this.navParams.data.hasOwnProperty('navCtrl') ? this.navParams.get('navCtrl') : undefined);
        this.records = (this.navParams.data.hasOwnProperty('data') ? this.navParams.get('data') : []);
        if (this.navParams.data.hasOwnProperty('haveTree')) {
            this.haveTree = this.navParams.get('haveTree');
        }
        if (this.navParams.data.hasOwnProperty('haveCensus')) {
            this.haveCensus = this.navParams.get('haveCensus');
        }
        if (this.navParams.data.hasOwnProperty('haveObservation')) {
            this.haveObservation = this.navParams.get('haveObservation');
        }
        if (this.navParams.data.hasOwnProperty('showLegend')) {
            this.showLegend = this.navParams.get('showLegend');
        }
    }

    public getStatusColor(record: ClientRecord) {
        if (record.id) {
            return '#ebf0df';
        }

        return record.valid ? '#ebffef' : '#ebf6ff';
    }

    public getDatasetIcon(record: ClientRecord): string {
        switch (record.datasetName) {
            case 'Koala Opportunistic Observation':
                return 'assets/imgs/eye.png';
            case 'KLM-SAT Census':
                return 'assets/imgs/poop.png';
            case 'KLM-SAT Tree Sighting':
                return 'assets/imgs/tree.png';
        }
    }

    public getCountIcon(record: ClientRecord): string {
        switch (record.datasetName) {
            case 'Koala Opportunistic Observation':
                return 'assets/imgs/koala.png';
            case 'KLM-SAT Census':
                return 'assets/imgs/tree.png';
            case 'KLM-SAT Tree Sighting':
                return 'assets/imgs/koala.png';
        }
    }

    private navPush(page, params) {
        if (!this.baseNavController) {
            this.navCtrl.push(page, params);
        } else {
            this.baseNavController.push(page, params);
        }
    }

    public itemTapped(event, record) {
        const page = record.datasetName.toLowerCase().indexOf('census') > -1 ? 'CensusPage' : 'ObservationPage';
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
        if (datasetName.toLowerCase().indexOf('census') > -1) {
            page = 'CensusPage';
        } else {
            if (this.parentId) {
                params['parentId'] = this.parentId;
            }
            page = 'ObservationPage';
        }
        this.navPush(page, params);
    }
}
