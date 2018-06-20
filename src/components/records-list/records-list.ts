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

    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    public getStatusColor(record: ClientRecord) {
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

    public itemTapped(event, record) {
        const page = record.datasetName.toLowerCase().indexOf('census') > -1 ? 'CensusPage' : 'ObservationPage';

        this.navCtrl.push(page, {
            datasetName: record.datasetName,
            recordClientId: record.client_id,
            parentId: record.parentId
        });
    }
}
