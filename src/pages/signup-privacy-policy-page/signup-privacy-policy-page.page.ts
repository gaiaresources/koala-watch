import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {SIGNUP_TERMS_AND_CONDITIONS_HTML } from "../../shared/utils/consts";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup-privacy-policy-page',
  templateUrl: './signup-privacy-policy-page.page.html',
  styleUrls: ['./signup-privacy-policy-page.page.scss'],
})
export class SignupPrivacyPolicyPagePage implements OnInit {

  htmlContent: SafeHtml

  constructor(private modalController: ModalController, private sanitizer: DomSanitizer, private router: Router) {
    this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(SIGNUP_TERMS_AND_CONDITIONS_HTML)
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  closeModal(answer: string) {
    this.modalController.dismiss().then(() => {
      if (answer === 'yes') {
        this.router.navigateByUrl('/signup');
      }
    });
  }

  ngOnInit() {
  }

}
