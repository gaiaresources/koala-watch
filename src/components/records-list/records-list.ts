import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Record } from '../../biosys-core/interfaces/api.interfaces';

class FooBoo implements Record {
    public created: string;
    public data: {};
    public dataset: number;
    public datetime: string;
    public geometry;
    public id: number;
    public last_modified: string;
    public name_id: number;
    public site: number;
    public source_info: {};
    public species_name: string;
    // FIXME: everything after here is for hacking the prototype together - need to work on extracting the REAL values later
    public icon: string;
    public koala_count: number;
    public data_status: string;
}

@Component({
    selector: 'records-list',
    templateUrl: 'records-list.html'
})
export class RecordsListComponent {
    selectedItem: any;
    items: Array<{ title: string, note: string, icon: string }>;
    
    // mapping from DataType to an icon
    public itemIcons = [
        'assets/imgs/koala_data_poop.png',
//        'assets/imgs/koala_data_torch.png',
        'assets/imgs/koala_data_eye.png'
    ];
    
    public data: Record[];
    
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        // If we navigated to this page, we will have an item available as a nav param
        this.selectedItem = navParams.get('item');
        
        this.data = [];
        for (let i = 0; i < 40; i++) {
            let row = new FooBoo();
            row.datetime = new Date().toISOString();
            this.data.push(row);
        }
        return;
    }
    
    public status(record: FooBoo) {
        // fixme: eventually this will reflect reality
        if (record.data_status !== undefined) {
            return record.data_status;
        }
        record.data_status = (Math.floor(Math.random() * 2) > 0) ? '#ebffef' : '#ebf6ff';
        return record.data_status;
    }
    
    public koalaCount(record: FooBoo): number {
        if (record.koala_count !== undefined) {
            return record.koala_count;
        }
        // FIXME: find out how to determine number of koalas from inside Record.data
        record.koala_count = Math.floor(Math.random() * 10);
        return record.koala_count;
    }
    
    public dataIcon(record: FooBoo): string {
        if (record.icon !== undefined) {
            return record.icon;
        }
        record.icon = this.itemIcons[Math.floor(Math.random() * this.itemIcons.length)];
        return record.icon;
    }
    
    public itemTapped(event, item) {
        // That's right, we're pushing to ourselves!
        this.navCtrl.push(RecordsListComponent, {
            item: item
        });
    }
}
