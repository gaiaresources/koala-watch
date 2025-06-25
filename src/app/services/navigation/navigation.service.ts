import {Injectable} from '@angular/core';
import {NavController} from "@ionic/angular";
import {ClientRecord} from "../../models/client-record";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private navCtrl: NavController,
  ) {
  }

  goObservation(record?: ClientRecord) {
    this.navCtrl.navigateForward('observation/' + (record ? record.client_id : 'create'));
  }

  goCensus(record?: ClientRecord) {
    this.navCtrl.navigateForward('census/' + (record ? record.client_id : 'create'));
  }

  goSurvey(parent: ClientRecord, record?: ClientRecord) {
    this.navCtrl.navigateForward('census/' + parent.client_id + '/survey/' + (record ? record.client_id : 'create'));
  }

  goSurveyRecords(parent: ClientRecord) {
    this.navCtrl.navigateBack('census/' + parent.client_id, {queryParams: { segmentId: 'observations' }});
  }

  goRecords() {
    this.navCtrl.navigateBack('records');
  }

}
