import {Injectable} from '@angular/core';
import {EmailComposer, OpenOptions} from "capacitor-email-composer";
import {Platform} from "@ionic/angular/standalone";
import {Browser} from "@capacitor/browser";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private platform: Platform,
  ) {
  }

  async open(email: OpenOptions) {
    if (this.platform.is('mobileweb')) {
      return Browser.open({
        url: this.buildUrl(email),
      });
    } else {
      return EmailComposer.open(email);
    }
  }

  private buildQueryParam(key: string, value: any) {
    if (value === undefined) return '';
    if (Array.isArray(value)) {
      return (key ? key + '=' : '') + value.join(',');
    }
    return (key ? key + '=' : '') + value;
  }

  private buildUrl(email: OpenOptions) {
    const params = [];
    const buildParam = this.buildQueryParam;
    params.push(buildParam('cc', email.cc));
    params.push(buildParam('bcc', email.bcc));
    params.push(buildParam('subject', email.subject));
    params.push(buildParam('body', email.body));
    return 'mailto:' + buildParam('', email.to) + '?' + params.filter((s) => !!s).join('&');
  }

}
