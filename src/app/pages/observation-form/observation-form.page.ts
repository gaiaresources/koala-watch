import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
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
import {StorageService} from "../../services/storage/storage.service";
import {DatasetService} from "../../services/dataset/dataset.service";

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
    FontAwesomeModule
  ]
})
export class ObservationFormPage implements OnInit {

  public DATASET_NAME_OBSERVATION = DATASET_NAME_OBSERVATION;
  public faSave = faSave;
  public faTrashCan = faTrashCan;
  public faCamera = faCamera
  public faImage = faImage

  @Input()
  readonly: boolean = false;

  segment: string = 'form';

  constructor(
    private activeRecordService: ActiveRecordService,
    private alertController: AlertController,
    private photoService: CameraService,
    private storageService: StorageService,
    private datasetService: DatasetService,
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
    // TODO: This should clear the activeRecord information.

    /*
    if (this.record) {
      this.photoGallery.rollback();
      this.storageService.deleteRecord(this.record.client_id!).subscribe(deleted => {
        if (this.record.photoIds) {
          from(this.record.photoIds).pipe(
            // TODO test
            mergeMap(photoId => this.storageService.deletePhoto(photoId as string))
          ).subscribe();
        }
        this.showLeavingAlertMessage = false;

        // TODO test
        this.navCtrl.navigateRoot('/home')
        //this.navCtrl.popToRoot();
      }, (error) => {
        this.alertController.create({
          header: 'Cannot Delete',
          message: 'Sorry, cannot delete this observation.',
          backdropDismiss: true,
          buttons: [
            {
              text: 'OK',
              handler: () => {
              }
            }
          ]
        }).then((alert) => {
          alert.present()
        });
      });
    } else {
      this.showLeavingAlertMessage = false;

      // TODO test
      this.navCtrl.navigateRoot('/home')
      //this.navCtrl.popToRoot();
    }
     */
  }

  doSave() {
    this.activeRecordService.save();
  }

}
