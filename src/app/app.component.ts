import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { mergeMap } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';

import { AuthService } from '../biosys-core/services/auth.service';
import { APIService } from '../biosys-core/services/api.service';
import { StorageService } from '../shared/services/storage.service';
import { Dataset, User } from '../biosys-core/interfaces/api.interfaces';

import { PROJECT_NAME } from '../shared/utils/consts';

@Component({
    templateUrl: 'app.html'
})
export class AppComponent implements OnInit {
    @ViewChild(Nav) nav: Nav;

    public menuItems: object[] = [
        {title: 'Home', page: 'HomePage', img: 'assets/imgs/home.png'},
        {title: 'Settings', page: 'SettingsPage', img: 'assets/imgs/settings.png'},
        {title: 'About', page: 'AboutPage', img: 'assets/imgs/about.png'},
        {title: 'Logout', img: 'assets/imgs/logout.png'},
    ];

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
                private alertController: AlertController, private apiService: APIService,
                private authService: AuthService, private storageService: StorageService) {
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
                this.apiService.getDatasets({project__name: PROJECT_NAME}).pipe(
                    mergeMap((datasets: Dataset[]) => from(datasets).pipe(
                        mergeMap((dataset: Dataset) => this.storageService.putDataset(dataset))
                    ))
                ).subscribe();

                this.apiService.whoAmI().pipe(
                    mergeMap((user: User) => this.storageService.putCurrentUser(user))
                ).subscribe();

                this.apiService.getUsers({project__name: PROJECT_NAME}).pipe(
                    mergeMap((users: User[]) => this.storageService.putTeamMembers(users))
                ).subscribe();

                this.nav.setRoot('HomePage');
            }
        });
    }

    public openPage(menuItem) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (menuItem.title === 'Logout') {
            this.askLogout();
        } else {
            this.nav.setRoot(menuItem.page);
        }
    }

    private askLogout() {
        this.alertController.create({
            title: 'Are you sure?',
            message: 'Are you sure you wish to log out?',
            enableBackdropDismiss: true,
            buttons: [
                {
                    text: 'Logout',
                    handler: () => {
                        this.authService.logout();
                        this.nav.setRoot('LoginPage');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }]
        }).present();
    }
}
