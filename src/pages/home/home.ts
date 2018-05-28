import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StorageService } from "../../app/storage.service";
import { Record } from "../../app/biosys-core/interfaces/api.interfaces";
import { UUID } from "angular2-uuid";

// FIXME: this can be removed once we start to get "real" data, along with the storageTest()
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
}

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    constructor(public navCtrl: NavController, private store: StorageService) {
    }
    
    ngOnInit(): void {
        return;
    }
    
    storageTest() {
        let rec: FooBoo;
        
        rec = new FooBoo();
        rec.data = { 'uuid': UUID.UUID() };
        
        let picker = function (value, key) {
            return key.startsWith("Record");
        };
        
        this.store.clearRecords().subscribe(clearResult => {
            this.store.putRecord(rec).subscribe(result => {
                if (result) {
                    this.store.putRecord(rec).subscribe((nextResult) => {
                        this.store.getRecords().subscribe((next) => {
                                alert(next.data['uuid']);
                            },
                            (err) => {
                                alert('Sorry: ' + err.message);
                            },
                            () => {
                                alert('Done');
                            });
                    });
                }
            });
        });
    }
}
