import {CommonModule, DOCUMENT} from '@angular/common';
import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit} from '@angular/core';
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
  IonNote, IonRouterLink,
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
import {GOOGLE_MAP_API} from "./tokens/gmap";
import {GoogleMapsService} from "./services/google-maps/google-maps.service";

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  faSignOutAlt = faSignOutAlt;
  public appPages: { title: string, url: string, icon: IconProp }[] = [
    {title: 'Records', url: '/records', icon: faTachometerAlt},
    {title: 'Settings', url: '/settings', icon: faCog},
    {title: 'About', url: '/about', icon: faInfoCircle},
    {title: 'Help', url: '/help', icon: faQuestionCircle},
    {title: 'Privacy Policy', url: '/privacy-policy', icon: faLock},
  ];

  user$: Observable<User | null>;

  constructor(
    @Inject(GOOGLE_MAP_API) private googleMapApi: string,
    @Inject(DOCUMENT) private document: any,
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private googleMaps: GoogleMapsService,
  ) {
    this.user$ = this.authenticationService.user$;
    addIcons({
      add,
      locate,
      pin,
    });
  }

  ngOnInit() {
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
