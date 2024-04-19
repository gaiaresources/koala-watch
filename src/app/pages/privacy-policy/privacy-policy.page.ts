import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { APP_NAME } from "../../tokens/app";
import { PrivacyPolicyComponent } from "../../components/privacy-policy/privacy-policy.component";

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, PrivacyPolicyComponent]
})
export class PrivacyPolicyPage implements OnInit {

  constructor(
    @Inject(APP_NAME) public appName: string,
  ) {
  }

  ngOnInit() {
  }

}
