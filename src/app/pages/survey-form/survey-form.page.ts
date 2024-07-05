import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RecordFormComponent} from "../../components/record-form/record-form.component";
import {RecordPhotosComponent} from "../../components/record-photos/record-photos.component";
import {DATASET_NAME_TREESURVEY} from "../../tokens/app";
import {faCamera, faImage, faSave, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {ActiveRecordService} from "../../services/active-record/active-record.service";
import {CameraService} from "../../services/camera/camera.service";
import {StorageService} from "../../services/storage/storage.service";
import {Observable} from "rxjs";
import {NavigationService} from "../../services/navigation/navigation.service";

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.page.html',
  styleUrls: ['./survey-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FaIconComponent, IonButton, IonButtons, IonFab, IonFabButton, IonMenuButton, IonSegment, IonSegmentButton, RecordFormComponent, RecordPhotosComponent, IonFabList, IonIcon]
})
export class SurveyFormPage implements OnInit {

  public DATASET_NAME_TREESURVEY = DATASET_NAME_TREESURVEY;
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
    private storageService: StorageService,
    private loadingCtrl: LoadingController,
    private navigationService: NavigationService,
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
      header: 'Tree Survey',
      message: 'Are you sure you want to delete this tree survey?',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            await this.loadingCtrl.create();
            await this.doDeleteRecord();
          }
        },
        {
          text: 'No'
        }
      ]
    });
    await alert.present();
  }

  async doCompleted() {
    await this.loadingCtrl.dismiss();
    await this.navigationService.goRecords();
  }

  async doDeleteRecord() {
    await this.activeRecordService.delete();
    await this.doCompleted();
  }

  async doSave() {
    await this.loadingCtrl.create();
    await this.activeRecordService.save();
    await this.doCompleted();
  }

}
