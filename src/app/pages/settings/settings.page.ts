import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonRow,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Observable } from "rxjs";
import { SettingsService } from "../../services/settings/settings.service";
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCard, IonCardContent, IonGrid, IonRow, IonLabel, IonToggle, IonButton]
})
export class SettingsPage implements OnInit {

  settings$: Observable<any>;

  constructor(private settingsService: SettingsService) {
    this.settings$ = this.settingsService.values$;
  }

  ngOnInit() {
  }

  update(key: string, value: any) {
    this.settingsService.set(key, value);
  }

  doClearUploaded() {
    // TODO: Not sure how to clear the uploaded records.
  }

}
