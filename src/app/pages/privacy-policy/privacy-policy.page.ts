import {Component, Inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { APP_NAME } from "../../tokens/app";
import { PrivacyPolicyComponent } from "../../components/privacy-policy/privacy-policy.component";
import {HeaderToolbarComponent} from '../../components/header-toolbar/header-toolbar.component';

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, PrivacyPolicyComponent, HeaderToolbarComponent]
})
export class PrivacyPolicyPage implements OnInit {

  @Input()
  showSideBarMenu = true;

  constructor(
    @Inject(APP_NAME) public appName: string,
  ) {
  }

  ngOnInit() {
  }

}
