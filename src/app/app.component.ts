import {CommonModule, DOCUMENT} from '@angular/common';
import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {
  AlertController,
  IonApp,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular/standalone';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "./services/authentication/authentication.service";
import {Observable} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {User} from "./models/user";
import {GOOGLE_MAP_API} from "./tokens/gmap";
import {GoogleMapsService} from "./services/google-maps/google-maps.service";
import {HeaderToolbarComponent} from './components/header-toolbar/header-toolbar.component';
import {faClose} from '@fortawesome/free-solid-svg-icons/faClose';
import {MenuController} from '@ionic/angular';

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
    IonMenuToggle,
    IonItem,
    IonLabel,
    IonRouterOutlet,
    HttpClientModule,
    FontAwesomeModule,
    HeaderToolbarComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  faSignOutAlt = faSignOutAlt;
  public appPages: { title: string, url: string}[] = [
    {title: 'Home', url: '/home'},
    {title: 'My records', url: '/records'},
    {title: 'Scat census', url: '/census'},
    {title: 'Settings', url: '/settings'},
    {title: 'About', url: '/about'},
    {title: 'Resources', url: '/resources'},
    {title: 'Help', url: '/help'},
    {title: 'Account', url: '/account'},
    {title: 'Privacy Policy', url: '/privacy-policy'},
  ];

  user$: Observable<User | null>;
  protected readonly faClose = faClose;

  constructor(
    @Inject(GOOGLE_MAP_API) private googleMapApi: string,
    @Inject(DOCUMENT) private document: any,
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private menu: MenuController,
    private googleMaps: GoogleMapsService,
  ) {
    this.user$ = this.authenticationService.user$;
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
