import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ObservationPage } from '../pages/observation/observation';
import { AuthService } from "../biosys-core/services/auth.service";

@Component({
    templateUrl: 'app.html'
})
export class AppComponent implements OnInit {
    @ViewChild(Nav) nav: Nav;

    public menuItems: object[] = [
        {title: 'Home', page: 'HomePage', img: 'assets/imgs/koala_home.png'},
        {title: 'Observation', component: ObservationPage, img: 'assets/imgs/koala_data_eye.png' },
        {title: 'Settings', page: 'SettingsPage', img: 'assets/imgs/koala_settings.png'},
        {title: 'About', page: 'AboutPage', img: 'assets/imgs/koala_about.png'},
        {title: 'Logout', img: 'assets/imgs/koala_logout.png'},
    ];

    constructor(public platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                private alertController: AlertController,
                private authService: AuthService) {
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
