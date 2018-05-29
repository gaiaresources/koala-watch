import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { DataList } from '../pages/data-list/data-list';
import { ObservationPage } from '../pages/observation/observation';
import { AuthService } from '../biosys-core/services/auth.service';
import { LoginPage } from '../pages/login/login';

@Component({
    templateUrl: 'app.html'
})
export class AppComponent implements OnInit {
    @ViewChild(Nav) nav: Nav;

    // rootPage: any = HomePage;

    pages: Array<{ title: string, component: any, img: any }>;

    constructor(public platform: Platform,
                public statusBar: StatusBar,
                public splashScreen: SplashScreen,
                private alertController: AlertController,
                private authService: AuthService) {

        // used for an example of ngFor and navigation
        this.pages = [
            {title: 'Home', component: DataList, img: 'assets/imgs/koala_home.png'},
            {title: 'Observation', component: ObservationPage, img: 'assets/imgs/koala_data_eye.png'},
            {title: 'Settings', component: ListPage, img: 'assets/imgs/koala_settings.png'},
            {title: 'About', component: ListPage, img: 'assets/imgs/koala_about.png'},
            {title: 'Logout', component: ListPage, img: 'assets/imgs/koala_logout.png'},
        ];
    }

    ngOnInit() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.nav.setRoot(HomePage);

            if (!this.authService.isLoggedIn()) {
                this.nav.push(LoginPage, {animate: false});
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

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (page.title === 'Logout') {
            this.askLogout();
        } else {
            this.nav.setRoot(page.component);
        }
    }
}
