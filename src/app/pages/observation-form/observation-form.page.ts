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
  IonImg,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {RecordFormComponent} from "../../components/record-form/record-form.component";
import {DATASET_NAME_OBSERVATION} from "../../tokens/app";
import {ActiveRecordService} from "../../services/active-record/active-record.service";
import {RecordPhotosComponent} from "../../components/record-photos/record-photos.component";
import {CameraService} from "../../services/camera/camera.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faCamera, faImage, faSave, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {Observable} from "rxjs";

@Component({
  selector: 'app-observation-form-page',
  templateUrl: './observation-form.page.html',
  styleUrls: ['./observation-form.page.scss'],
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
    IonImg,
    FontAwesomeModule,
    IonFabList,
    IonIcon
  ]
})
export class ObservationFormPage implements OnInit {

  public DATASET_NAME_OBSERVATION = DATASET_NAME_OBSERVATION;
  public faSave = faSave;
  public faTrashCan = faTrashCan;
  public faCamera = faCamera;
  public faImage = faImage;

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

  doDeleteRecord() {
    this.activeRecordService.delete();
  }

  doSave() {
    this.activeRecordService.save();
  }

}
