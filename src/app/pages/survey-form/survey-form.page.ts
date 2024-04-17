import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader, IonMenuButton, IonSegment, IonSegmentButton, IonTabBar, IonTabButton, IonTabs,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { DATASET_NAME_TREESURVEY } from "../../tokens/app";
import { RecordFormComponent } from "../../components/record-form/record-form.component";
import { RecordPhotosComponent } from "../../components/record-photos/record-photos.component";
import {PhotoService} from "../../services/photo/photo.service";

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.page.html',
  styleUrls: ['./survey-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonFab, IonFabButton, IonMenuButton, IonTabBar, IonTabButton, IonTabs, IonButton, IonSegment, IonSegmentButton, RecordFormComponent, RecordPhotosComponent]
})
export class SurveyFormPage implements OnInit {

  public DATASET_NAME_TREESURVEY = DATASET_NAME_TREESURVEY;

  @Input()
  readonly: boolean = false;

  segment: string = 'form';

  constructor(
    private photoService: PhotoService
  ) {
  }

  ngOnInit() {
  }

  async doCamera() {
    return this.photoService.getCameraPhoto();
  }

  async doGallery() {
    return this.photoService.getLibraryPhoto();
  }

  doSave() {

  }

  async doDelete() {
    // TODO
  }
}
