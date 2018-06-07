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

    // mapping from DataType to an icon
    public itemIcons = [
        'assets/imgs/koala_data_poop.png',
        'assets/imgs/koala_data_eye.png'
    ];

    @Input()
    public records: ClientRecord[];

    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    public getStatusColor(record: ClientRecord) {
        return record.valid ? '#ebffef' : '#ebf6ff';
    }

    public getIcon(record: ClientRecord): string {
        if (record.datasetName === 'Koala Opportunistic Observation') {
            return 'assets/imgs/koala_data_eye.png'
        }
    }

    public itemTapped(event, record) {
        this.navCtrl.push('ObservationPage', {
            datasetName: record.datasetName,
            recordClientId: record.client_id
        });
    }
}
