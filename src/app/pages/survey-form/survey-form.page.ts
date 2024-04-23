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
import { PhotoService } from "../../services/photo/photo.service";
import { ActiveRecordService } from "../../services/active-record/active-record.service";
import { StorageService } from "../../services/storage/storage.service";
import { UUID } from "angular2-uuid";

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
    private activeRecordService: ActiveRecordService,
    private photoService: PhotoService,
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    if (this.activeRecordService.getClientId()) {
      let clientId = this.activeRecordService.getClientId();
      this.storageService.load('Record_' + clientId).then(record => this.activeRecordService.setValues(record.data));
    }
    else {
      this.activeRecordService.setClientId(UUID.UUID());
    }
  }

  async doCamera() {
    return this.photoService.getCameraPhoto();
  }

  async doGallery() {
    return this.photoService.getLibraryPhoto();
  }

  doSave() {
    const formValues = this.activeRecordService.getValues();

    this.storageService.putRecord({
      // TODO check record valid
      valid: true, //this.recordForm.valid,
      client_id: this.activeRecordService.getClientId(),
      // TODO where should this value be coming from?
      dataset: 107,
      datasetName: DATASET_NAME_TREESURVEY,
      // TODO get date from Record if set.
      datetime: new Date().toISOString(),
      data: formValues,
      // TODO Count?
      count: 0,
      photoIds: [],
    });
  }

  async doDelete() {
    // TODO
  }
}
