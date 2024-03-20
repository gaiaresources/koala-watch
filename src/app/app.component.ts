import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonNav, MenuController, NavController, Platform} from '@ionic/angular';
import {StatusBar, Style} from '@capacitor/status-bar';
import {SplashScreen} from '@capacitor/splash-screen';

import {from, Subscription} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

import {AuthService} from '../biosys-core/services/auth.service';
import {APIService} from '../biosys-core/services/api.service';
import {StorageService} from '../shared/services/storage.service';
import {Dataset, User} from '../biosys-core/interfaces/api.interfaces';

import {PROJECT_NAME} from '../shared/utils/consts';
import {Router} from "@angular/router";
import {IconName} from "@fortawesome/fontawesome-svg-core";
import {environment} from "../environments/environment";
import {AuthenticatedService} from "../shared/services/authenticated.service";

class MenuItem {
    title: string;
    page?: string;
    icon: IconName;
}

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild(IonNav) nav!: IonNav;

    private resumeSubscription!: Subscription;

    public menuItems: MenuItem[] = [
        {title: 'Records', page: '/home', icon: 'tachometer-alt'}, /// Might be wrong page
        {title: 'Settings', page: '/settings', icon: 'cog'},
        {title: 'About', page: '/about', icon: 'info-circle'},
        {title: 'Help', page: '/help', icon: 'question-circle'},
        {title: 'Privacy Policy', page: '/privacypolicy', icon: 'lock'},
        {title: 'Log out', icon: 'sign-out-alt'},
        // TODO Remove this TESTING ONLY
        {title: 'Observation', page: '/observation', icon: 'info-circle'},
    ];


  constructor(
      public platform: Platform,
      private alertController: AlertController,
      private apiService: APIService,
      private authService: AuthService,
      private storageService: StorageService,
      private router: Router,
      private menuController: MenuController,
      private authenticatedService: AuthenticatedService,
      private cdr: ChangeDetectorRef) {
  }

    async ngOnInit() {

      this.router.events.subscribe((event) => {
          console.log("Testing - Printing Event: " + event)
      })

      // Make sure we create the database storage before accessing
      await this.storageService.initiate()

      this.platform.ready().then(async () => {

        try {
          await this.loadGoogleMaps();
        } catch (e) {
          console.error(e)
        }

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.setStyle({style: Style.Default});
        SplashScreen.hide().then();

        this.refreshAuthenticationCheck()

        if (!this.isAuthenticated()) {
          this.router.navigateByUrl('/login')
        } else {
          this.reloadMetadata();
          // this.router.navigateByUrl('/home')
        }
      });

        this.resumeSubscription = this.platform.resume.subscribe(() => {
            if (this.authService.isLoggedIn()) {
                this.reloadMetadata();
            }
        });
    }

    ngOnDestroy() {
        this.resumeSubscription.unsubscribe();
    }

    updateView() {
      this.cdr.detectChanges();
    }

    public openPage(menuItem: MenuItem) {
      // Close the menu
        this.menuController.close()

        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (menuItem.title === 'Log out') {
            this.askLogout();
        } else if (menuItem.page != null){
          this.router.navigateByUrl(menuItem.page)
        }
    }
    public refreshAuthenticationCheck(){
      this.authenticatedService.setAuthenticated(this.authService.isLoggedIn())
    }

    public isAuthenticated(): boolean {
      return this.authenticatedService.isAuthenticated()
    }

    private reloadMetadata() {
        this.apiService.getDatasets({project__name: PROJECT_NAME}).pipe(
            mergeMap((datasets: Dataset[]) => from(datasets).pipe(
                mergeMap((dataset: Dataset) => this.storageService.putDataset(dataset))
            ))
        ).subscribe();

        this.apiService.getUsers({project__name: PROJECT_NAME}).pipe(
            mergeMap((users: User[]) => this.storageService.putTeamMembers(users))
        ).subscribe();
    }

    private askLogout() {
        this.alertController.create({
            header: 'Are you sure?',
            message: 'Are you sure you wish to log out?',
            backdropDismiss: true,
            buttons: [
                {
                    text: 'Log Out',
                    handler: () => {
                        this.authService.logout();
                        this.refreshAuthenticationCheck()
                        this.router.navigateByUrl('/login')
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        }).then(alert => {alert.present()})
    }

  private getGoogleMapsApiKey(): string {
    if (this.platform.is('ios')) {
      return environment.googleMapsiOSApiKey;
    } else if (this.platform.is('android')) {
      return environment.googleMapsAndroidApiKey;
    } else {
      // Default to a (hopefully) valid API Key
      return environment.googleMapsAndroidApiKey;
    }
  }

  private loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {

      if (typeof google !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.getGoogleMapsApiKey();
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        resolve();
      };

      script.onerror = (error) => {
        reject('Google Maps script failed to load: ' + error);
      };
    })
  }
}
