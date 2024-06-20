import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {
  AlertController,
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
  IonToolbar
} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {add, locate, pin,} from 'ionicons/icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faCog,
  faInfoCircle,
  faLock,
  faQuestionCircle,
  faSignOutAlt,
  faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {AuthenticationService} from "./services/authentication/authentication.service";
import {Observable} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {User} from "./models/user";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    HttpClientModule,
    FontAwesomeModule,
  ],
})
export class AppComponent {
  faSignOutAlt = faSignOutAlt;
  public appPages: { title: string, url: string, icon: IconProp }[] = [
    {title: 'Records', url: '/observation', icon: faTachometerAlt},
    {title: 'Settings', url: '/settings', icon: faCog},
    {title: 'About', url: '/about', icon: faInfoCircle},
    {title: 'Help', url: '/help', icon: faQuestionCircle},
    {title: 'Privacy Policy', url: '/privacy-policy', icon: faLock},
  ];

  user$: Observable<User | null>;

  constructor(
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
  ) {
    this.user$ = this.authenticationService.user$;
    addIcons({
      add,
      locate,
      pin,
    });
  }

  askLogout() {
    this.alertController.create({
      header: 'Are you sure?',
      message: 'Are you sure you wish to log out?',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Log Out',
          handler: () => {
            this.authenticationService.logout();
            return this.router.navigateByUrl('/login');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }]
    }).then(alert => alert.present())
  }
}
