import {Injectable} from '@angular/core';
import {AlertController, Platform} from "@ionic/angular/standalone";
import {Browser} from "@capacitor/browser";

export interface EmailOptions {
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private platform: Platform,
    private alertController: AlertController,
  ) {
  }

  async open(email: EmailOptions) {
    return Browser.open({
      url: this.buildUrl(email),
    }).catch(async (e) => {
      const alert = await this.alertController.create({
        message: "Unable to open default mail client",
      });
      await alert.present;
    });
  }

  private buildQueryParam(key: string, value: any) {
    if (value === undefined) return '';
    if (Array.isArray(value)) {
      return (key ? key + '=' : '') + encodeURIComponent(value.join(','));
    }
    return (key ? key + '=' : '') + encodeURIComponent(value);
  }

  private buildUrl(email: EmailOptions) {
    const params = [];
    const buildParam = this.buildQueryParam;
    params.push(buildParam('cc', email.cc));
    params.push(buildParam('bcc', email.bcc));
    params.push(buildParam('subject', email.subject));
    params.push(buildParam('body', email.body));
    return 'mailto:' + buildParam('', email.to) + '?' + params.filter((s) => !!s).join('&');
  }

}
