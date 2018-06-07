import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClientRecord } from "../../shared/interfaces/mobile.interfaces";
import { CensusObservationPage } from "../census-observation/census-observation";
import { RecordsListComponent } from "../../components/records-list/records-list";

/**
 * Generated class for the CensusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-census',
  templateUrl: 'census.html',
})
export class CensusPage {
    public observations: ClientRecord[];
    public showOboAdd: boolean = false;
    public observationsList = RecordsListComponent;
    
  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.observations = new Array();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CensusPage');
  }
  
  public addSatObo() {
      this.navCtrl.push('CensusObservationPage', {'datasetName': 'Koala Opportunistic Observation'});
  }
  
}
