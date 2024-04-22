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
import { UUID } from "angular2-uuid";
import { ActiveRecordService } from "../../services/active-record/active-record.service";
import { StorageService } from "../../services/storage/storage.service";

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
    private activeRecordService: ActiveRecordService,
    private photoService: PhotoService,
    private storageService: StorageService,
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
    const formValues = this.activeRecordService.getValues();

    this.storageService.putRecord({
      // TODO check record valid
      valid: true, //this.recordForm.valid,
      // TODO set this on new record (in ionViewWillEnter?)
      client_id: UUID.UUID(),
      // TODO where should this value be coming from?
      dataset: 105,
      datasetName: DATASET_NAME_CENSUS,
      // TODO get date from Record if set.
      datetime: new Date().toISOString(),
      data: formValues,
      // TODO Count?
      count: 0,
      photoIds: [],
    });

  }

}
