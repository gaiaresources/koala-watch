import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../shared/services/storage.service';
import { Record } from '../../biosys-core/interfaces/api.interfaces';
import { UUID } from 'angular2-uuid';
import { APIService } from '../../biosys-core/services/api.service';
import { AuthService } from '../../biosys-core/services/auth.service';

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

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {
    constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: APIService,
                private authService: AuthService, private store: StorageService) {
    }

    ngOnInit(): void {
    }

    storageTest() {
        let rec: FooBoo;

        rec = new FooBoo();
        rec.data = { 'uuid': UUID.UUID() };

        let picker = function (value, key) {
            return key.startsWith('Record');
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
