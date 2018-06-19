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
    
    @Input()
    public theRealNavController: NavController = undefined;
    
    @Input()
    public parent: string;
    
    @Input()
    public haveObo: boolean = true;
    @Input()
    public haveCensus: boolean = true;
    @Input()
    public haveTree: boolean = true;
    
    constructor(public navCtrl: NavController,
                public navParams: NavParams) {
        this.theRealNavController = (this.navParams.data.hasOwnProperty('navCtrl') ? this.navParams.get('navCtrl') : undefined);
        this.records = (this.navParams.data.hasOwnProperty('data') ? this.navParams.get('data') : []);
        if (this.navParams.data.hasOwnProperty('haveTree'))
            this.haveTree = this.navParams.get('haveTree');
        if (this.navParams.data.hasOwnProperty('haveCensus'))
            this.haveCensus = this.navParams.get('haveCensus');
        if (this.navParams.data.hasOwnProperty('haveObo'))
            this.haveObo = this.navParams.get('haveObo');
        if (this.navParams.data.hasOwnProperty('showLegend'))
            this.showLegend = this.navParams.get('showLegend');
    }
    
    public getStatusColor(record: ClientRecord) {
        return record.valid ? '#ebffef' : '#ebf6ff';
    }
    
    public getIcon(record: ClientRecord): string {
        switch (record.datasetName) {
            case 'Koala Opportunistic Observation':
                return 'assets/imgs/koala_data_eye.png';
            case 'KLM-SAT Census':
                return 'assets/imgs/koala_data_poop.png';
            case 'KLM-SAT Tree Sighting':
                return 'assets/imgs/koala_data_tree.png';
        }
    }
    
    private navPush(page, params) {
        if (this.theRealNavController === undefined)
            this.navCtrl.push(page,params);
        else
            this.theRealNavController.push(page,params);
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
        let params = {
            datasetName: datasetName,
        };
        if (datasetName.toLowerCase().indexOf('census') > -1)
            page = 'CensusPage';
        else {
            if (this.parent) {
                params['parentId'] = this.parent;
                alert(this.parent);
            }
            page = 'ObservationPage';
        }
        this.navPush(page, params);
    }
}
