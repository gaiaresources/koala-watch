import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from "../biosys-core/services/auth.service";
import { APIService } from "../biosys-core/services/api.service";
import { StorageService } from "../shared/services/storage.service";

@Component({
    templateUrl: 'app.html'
})
export class AppComponent implements OnInit {
    @ViewChild(Nav) nav: Nav;

    public menuItems: object[] = [
        {title: 'Home', page: 'HomePage', img: 'assets/imgs/koala_home.png'},
        {title: 'Settings', page: 'SettingsPage', img: 'assets/imgs/koala_settings.png'},
        {title: 'About', page: 'AboutPage', img: 'assets/imgs/koala_about.png'},
        {title: 'Logout', img: 'assets/imgs/koala_logout.png'},
    ];

    constructor(public platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                private alertController: AlertController,
                private authService: AuthService,
                private api: APIService,
                private store: StorageService) {
    }

    ngOnInit() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            if (!this.authService.isLoggedIn()) {
                this.nav.setRoot('LoginPage');
            } else {
                this.nav.setRoot('HomePage');
            }
            
            /*  FIXME: The backend needs to support the dataset API endpoint WITHOUT authentication,
                or some sort of weird default auth_token needs to be created, so as to avoid stopping
                a user from entering data despite not having logged in. */
            localStorage.setItem('auth_token', '27eb3ec6b0370f78b7bd5c3ad865c30cf7ea3493');
            this.api.getDatasets().subscribe(datasets =>{
                for (let i=0; i < datasets.length; i++) {
                    this.store.putDataset(datasets[i]);
                }
            }, apiError => {
            });
        });
    }

    askLogout() {
        const alert = this.alertController.create({
            title: 'Are you sure?',
            message: 'Are you sure you wish to log out?',
            enableBackdropDismiss: true,
            buttons: [
                {
                    text: 'Logout',
                    handler: () => this.authService.logout()
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        });
        alert.present();
    }

    openPage(menuItem) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (menuItem.title === 'Logout') {
            this.askLogout();
        } else {
            this.nav.setRoot(menuItem.page);
        }
    }
}
