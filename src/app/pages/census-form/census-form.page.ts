import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton, IonFabList,
  IonHeader, IonIcon,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RecordFormComponent} from "../../components/record-form/record-form.component";
import {RecordPhotosComponent} from "../../components/record-photos/record-photos.component";
import {DATASET_NAME_CENSUS} from "../../tokens/app";
import {faCamera, faImage, faSave, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {ActiveRecordService} from "../../services/active-record/active-record.service";
import {CameraService} from "../../services/camera/camera.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-census-form-page',
  templateUrl: './census-form.page.html',
  styleUrls: ['./census-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FaIconComponent, IonButton, IonButtons, IonFab, IonFabButton, IonMenuButton, IonSegment, IonSegmentButton, RecordFormComponent, RecordPhotosComponent, IonFabList, IonIcon]
})
export class CensusFormPage implements OnInit {

  public DATASET_NAME_CENSUS = DATASET_NAME_CENSUS;
  public faCamera = faCamera;
  public faImage = faImage;
  public faSave = faSave;
  public faTrashCan = faTrashCan;

  segment: string = 'form';

  writeable$: Observable<boolean>;

  constructor(
    private activeRecordService: ActiveRecordService,
    private alertController: AlertController,
    private photoService: CameraService,
  ) {
    this.writeable$ = this.activeRecordService.writeable$;
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
            this.doDeleteRecord();
          }
        },
        {
          text: 'No'
        }
      ]
    });
    await alert.present();
  }

  doNewSurvey() {
    // TODO: This should create a new active record for the tree survey dataset
    // and set the parentId to the current active record client_id.
  }

  doDeleteRecord() {
    this.activeRecordService.delete();
  }

  doSave() {
    this.activeRecordService.save();
  }
}
