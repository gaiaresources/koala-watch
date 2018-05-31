import { Record } from "../../biosys-core/interfaces/api.interfaces";
import { ObservationPage } from "../observation/observation";
import { APIService } from "../../biosys-core/services/api.service";
import { StorageService } from "../../shared/services/storage.service";
import { AuthService } from "../../biosys-core/services/auth.service";
import { RecordsListComponent } from "../../components/records-list/records-list";
import { RecordsMapComponent } from "../../components/records-map/records-map";
import { FabContainer, IonicPage, NavController, NavParams } from "ionic-angular";
import { Component, ViewChild } from "@angular/core";
import { UUID } from "angular2-uuid";

// FIXME: this can be removed once we start to get 'real' data, along with the storageTest()
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
    public dataTypes = DataType;
    @ViewChild('fabNew') fabNew: FabContainer;

    constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: APIService,
                private authService: AuthService, private store: StorageService) {
    }

    public clickedUpload() {
        return;
    }

    public clickedNew(datasetId: number) {
        this.navCtrl.push('ObservationPage', {datasetId: datasetId});
    }

    private storageTest() {
        let rec: FooBoo;

        rec = new FooBoo();
        rec.data = { 'uuid': UUID.UUID() };

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

    public clickedNew(type: DataType, fabContainer: FabContainer) {
        fabContainer.close();
        this.navCtrl.push('ObservationPage');
    }
}
