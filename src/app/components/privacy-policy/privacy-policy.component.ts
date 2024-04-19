import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";

@Component({
  standalone: true,
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  imports: [
    IonicModule
  ]
})
export class PrivacyPolicyComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
