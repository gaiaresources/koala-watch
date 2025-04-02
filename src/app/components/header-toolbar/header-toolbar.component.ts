import {Component, Input} from '@angular/core';
import {IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton} from '@ionic/angular/standalone';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonToolbar, NgIf, IonButtons, IonMenuButton]
})
export class HeaderToolbarComponent {

  @Input()
  title: string = "";

  @Input()
  showSideMenu: boolean = true;
}
