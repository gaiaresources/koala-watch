import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Subscription } from 'rxjs';
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
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild(Nav) nav: Nav;

    private resumeSubscription: Subscription;

    public menuItems: object[] = [
        {title: 'Records', page: 'HomePage', icon: 'tachometer-alt'},
        {title: 'Settings', page: 'SettingsPage', icon: 'cog'},
        {title: 'About', page: 'AboutPage', icon: 'info-circle'},
        {title: 'Help', page: 'HelpPage', icon: 'question-circle'},
        {title: 'Log out', icon: 'sign-out-alt'},
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
                this.reloadMetadata();
                this.nav.setRoot('HomePage');
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

    public openPage(menuItem) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        if (menuItem.title === 'Log out') {
            this.askLogout();
        } else {
            this.nav.setRoot(menuItem.page);
        }
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
            title: 'Are you sure?',
            message: 'Are you sure you wish to log out?',
            enableBackdropDismiss: true,
            buttons: [
                {
                    text: 'Log Out',
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
