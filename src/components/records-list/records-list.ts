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
    public showLegend: boolean = true;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        if (navParams.data !== undefined) {
            if (navParams.data.hasOwnProperty('data'))
                this.records = navParams.data.data;
            if (navParams.data.hasOwnProperty('showLegend'))
                this.showLegend = navParams.data.showLegend;
        }
    }

    public getStatusColor(record: ClientRecord) {
        return record.valid ? '#ebffef' : '#ebf6ff';
    }

    public getIcon(record: ClientRecord): string {
        if (record.datasetName === 'Koala Opportunistic Observation') {
            return 'assets/imgs/koala_data_eye.png'
        } else
            return 'assets/imgs/koala_data_poop.png';
    }

    public itemTapped(event, record) {
        if (record.datasetName === 'Koala Opportunistic Observation')
            this.navCtrl.push('ObservationPage', {
                datasetName: record.datasetName,
                recordClientId: record.client_id
            });
        else
            this.navCtrl.push('CensusPage', {
                recordClientId: record.client_id,
                isNew: false
            });
    }
}
