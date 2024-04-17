import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons, IonCard, IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { RecordFormComponent } from "../../components/record-form/record-form.component";
import { DATASET_NAME_CENSUS } from "../../tokens/app";
import { RecordPhotosComponent } from "../../components/record-photos/record-photos.component";
import { PhotoService } from "../../services/photo/photo.service";

@Component({
  selector: 'app-census-form-page',
  templateUrl: './census-form.page.html',
  styleUrls: ['./census-form.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSegment,
    IonSegmentButton,
    IonButtons,
    IonMenuButton,
    IonButton,
    RecordFormComponent,
    RecordPhotosComponent,
    IonFab,
    IonFabButton,
    IonCard,
    IonCardContent,
  ]
})
export class CensusFormPage implements OnInit {

  public DATASET_NAME_CENSUS = DATASET_NAME_CENSUS;

  @Input()
  readonly: boolean = false;

  segment: string = 'form';

  constructor(
    private photoService: PhotoService,
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

  async doDelete() {

  }

  doSave() {

  }

}
