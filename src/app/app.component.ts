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
import {GOOGLE_MAP_API} from "./tokens/gmap";

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
    {title: 'Records', url: '/observation', icon: faTachometerAlt},
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
  ) {
    this.user$ = this.authenticationService.user$;
    addIcons({
      add,
      locate,
      pin,
    });
  }

  ngOnInit() {
    this.addGoogleScript();
  }

  addGoogleScript() {
    const s = this.document.createElement('script');
    s.type = 'text/javascript';
    s.innerHTML = '(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({\n' +
      '  v: "weekly",\n' +
      '  key: "'+ this.googleMapApi +'"\n' +
      '});'
    const head = this.document.getElementsByTagName('head')[0];
    head.appendChild(s);
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
