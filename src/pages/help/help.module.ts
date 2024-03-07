import { NgModule } from '@angular/core';
import {IonicModule, NavController, NavParams} from '@ionic/angular';
import { HelpPage } from './help';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: HelpPage
  }
]
@NgModule({
  declarations: [
    HelpPage,
  ],
  imports: [
    IonicModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  providers: [
      NavController,
      NavParams
  ]
})
export class HelpPageModule {
  constructor() {
    library.add(faBars);
  }
}
