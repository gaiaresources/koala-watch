import {Component, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent, IonFooter,
  ModalController
} from '@ionic/angular/standalone';
import {Router} from "@angular/router";
import {PrivacyPolicyComponent} from "../privacy-policy/privacy-policy.component";
import {HeaderToolbarComponent} from '../header-toolbar/header-toolbar.component';

@Component({
  standalone: true,
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
  imports: [
    IonButtons,
    IonButton,
    IonContent,
    PrivacyPolicyComponent,
    HeaderToolbarComponent,
    IonFooter
  ]
})
export class SignupModalComponent implements OnInit {

  constructor(private modalController: ModalController, private router: Router) {
  }

  ngOnInit() {
  }

  async accept() {
    return this.modalController.dismiss().then(() => {
      return this.router.navigateByUrl('/sign-up');
    });
  }

  async reject() {
    await this.modalController.dismiss();
  }

}
