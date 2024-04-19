import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonRow,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import { Router } from "@angular/router";
import { PrivacyPolicyComponent } from "../privacy-policy/privacy-policy.component";

@Component({
  standalone: true,
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonRow,
    IonCol,
    PrivacyPolicyComponent
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
