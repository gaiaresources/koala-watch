import { Record } from "../../biosys-core/interfaces/api.interfaces";
import { ObservationPage } from "../observation/observation";
import { APIService } from "../../biosys-core/services/api.service";
import { StorageService } from "../../shared/services/storage.service";
import { AuthService } from "../../biosys-core/services/auth.service";
import { RecordsListComponent } from "../../components/records-list/records-list";
import { RecordsMapComponent } from "../../components/records-map/records-map";
import { FabContainer, IonicPage, Loading, LoadingController, NavController, NavParams } from "ionic-angular";
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
    
    private loadingDialog: Loading;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, private apiService: APIService,
                private authService: AuthService,
                private store: StorageService,
                public loadingCtrl: LoadingController) {
    }

    public clickedUpload() {
        this.loadingDialog = this.loadingCtrl.create({
            content: 'Uploading Data To BioSys Server...'
        });
        
        this.store.getRecords(() => {return true;}).subscribe(value => {
             this.apiService.createRecord(value).subscribe(value => {
             }, error => {
                // TODO: error handling
             },
             () => {
                 // TODO: in the real version, delete Record from "views"
             });
            },
            error1 => {
                // TODO: error handling
                this.loadingDialog.dismiss();
            },
            () => {
            this.loadingDialog.dismiss();
        });
        this.loadingDialog.present();
    }

    public clickedNew(datasetId: number, fabContainer: FabContainer) {
        fabContainer.close();
        // datasetId = 101; // VLC: borking countermeasure
        this.navCtrl.push('ObservationPage', {datasetId: datasetId});
    }
}
