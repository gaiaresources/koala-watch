import {CommonModule} from '@angular/common';
import {Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {
  AlertController,
  IonApp,
  IonContent, IonIcon,
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
  faArrowDown,
  faArrowRight, faChevronDown, faChevronRight,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import {AuthenticationService} from "./services/authentication/authentication.service";
import {Observable} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {User} from "./models/user";
import {HeaderToolbarComponent} from './components/header-toolbar/header-toolbar.component';
import {GoogleMapsService} from '../app/services/google-maps/google-maps.service';


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
    IonIcon,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  faSignOutAlt = faSignOutAlt;
  public appPages: { title: string, children?: any[], url?: string, isOpen?: boolean}[] = [
    {title: 'Home', url: '/home'},
    {title: 'Records',
      children:
        [
          {title: "My records", url: '/records'},
          {title: "Record display", url: '/settings'},
        ],
      isOpen: false
    },
    {title: 'Resources',
      children:
        [
          {title: "About I Spy Koala", url: '/about'},
          {title: "How to: Observations", url: '/help'},
          {title: "How to: Scat census", url: '/census-help'},
          {title: "Additional resources", url: '/resources'},
        ],
      isOpen: false
    },
    {title: 'Account',
      children:
        [
          {title: "Terms and conditions", url: '/privacy-policy'},
          {title: "Delete account", url: '/account'}
        ],
      isOpen: false
    }
  ];

  user$: Observable<User | null>;

  constructor(
    private authenticationService: AuthenticationService,
    private alertController: AlertController,
    private googleMapsService: GoogleMapsService,
    private router: Router,
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

  protected readonly faArrowRight = faArrowRight;
  protected readonly faArrowDown = faArrowDown;
  protected readonly faChevronRight = faChevronRight;
  protected readonly faChevronDown = faChevronDown;
}
