import { Record } from "../../biosys-core/interfaces/api.interfaces";
import { ObservationPage } from "../observation/observation";
import { APIService } from "../../biosys-core/services/api.service";
import { StorageService } from "../../shared/services/storage.service";
import { AuthService } from "../../biosys-core/services/auth.service";
import { RecordsListComponent } from "../../components/records-list/records-list";
import { RecordsMapComponent } from "../../components/records-map/records-map";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { UUID } from "angular2-uuid";

enum DataType {
    Poop = 0,
    Torch = 1,
    Visual = 2
}

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
export class HomePage {
    public listRoot = RecordsListComponent;
    public mapRoot = RecordsMapComponent;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: APIService,
                private authService: AuthService, private store: StorageService) {
    }

    public clickedSync() {
        return;
    }
    
    public clickedNew(type: DataType) {
        this.navCtrl.setRoot(ObservationPage);
        return;
    }
    
    private storageTest() {
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
