import { Injectable } from '@angular/core';
import { NavController } from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private navCtrl: NavController,
  ) {
  }

  goObservation() {
    this.navCtrl.navigateForward('observation/form');
  }

  goCensus() {
    this.navCtrl.navigateForward('census/form');
  }

  goSurvey() {
    this.navCtrl.navigateForward('survey/form');
  }

}
