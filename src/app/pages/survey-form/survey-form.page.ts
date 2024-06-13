import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader, IonMenuButton, IonSegment, IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RecordFormComponent } from "../../components/record-form/record-form.component";
import { RecordPhotosComponent } from "../../components/record-photos/record-photos.component";
import { DATASET_NAME_TREESURVEY } from "../../tokens/app";
import { faCamera, faImage, faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ActiveRecordService } from "../../services/active-record/active-record.service";
import { CameraService } from "../../services/camera/camera.service";
import { StorageService } from "../../services/storage/storage.service";
import { UUID } from "angular2-uuid";

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.page.html',
  styleUrls: ['./survey-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FaIconComponent, IonButton, IonButtons, IonFab, IonFabButton, IonMenuButton, IonSegment, IonSegmentButton, RecordFormComponent, RecordPhotosComponent]
})
export class SurveyFormPage implements OnInit {

  public DATASET_NAME_TREESURVEY = DATASET_NAME_TREESURVEY;
  public faCamera = faCamera;
  public faImage = faImage;
  public faSave = faSave;
  public faTrashCan = faTrashCan;

  @Input()
  readonly: boolean = false;

  segment: string = 'form';

  constructor(
    private activeRecordService: ActiveRecordService,
    private alertController: AlertController,
    private photoService: CameraService,
    private storageService: StorageService,
  ) {
    // Client record plus data.
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
    const alert = await this.alertController.create({
      header: 'Observation',
      message: 'Are you sure you want to delete this observation?',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteRecord();
          }
        },
        {
          text: 'No'
        }
      ]
    });
    await alert.present();
  }

  deleteRecord() {
  }

  doSave() {
    /*
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
     */
  }
}
