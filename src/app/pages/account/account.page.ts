import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  Platform
} from '@ionic/angular/standalone';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {EmailService} from "../../services/email/email.service";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonButton]
})
export class AccountPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private emailService: EmailService,
  ) {
  }

  ngOnInit() {
  }

  async doDeleteAccount() {
    const confirmDelete = await this.alertController.create({
      header: 'Confirm Deletion',
      subHeader: 'This will generate an email to be sent to BioNet support to delete your account',
      buttons: [
        {
          text: 'Delete',
          role: 'delete',
          handler: async (info) => {
            const user = await firstValueFrom(this.authenticationService.user$);
            if (!user) return;

            await this.emailService.open({
              to: ['bionet@environment.nsw.gov.au'],
              subject: 'I Spy Koala account deletion request',
              body: `I Spy Koala account deletion request for the Username - ${user.username} (${user.email})` +
                "\n" +
                "An email confirming the request will be sent to the email address associated with this account within 48 hours of submission.\n" +
                "\n" +
                "Thanks\n" +
                "\n" +
                "I Spy Koala team",
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ],
    });

    await confirmDelete.present();
  }

}
