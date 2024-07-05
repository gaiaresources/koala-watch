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
  IonImg,
  IonLabel,
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
import {DATASET_NAME_CENSUS} from "../../tokens/app";
import {faCamera, faImage, faSave, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {ActiveRecordService} from "../../services/active-record/active-record.service";
import {CameraService} from "../../services/camera/camera.service";
import {combineLatest, map, Observable} from "rxjs";
import {NavigationService} from "../../services/navigation/navigation.service";
import {RecordsService} from "../../services/records/records.service";
import {ClientRecord} from "../../models/client-record";
import {RecordsListComponent} from "../../components/records-list/records-list.component";
import {SettingsService} from "../../services/settings/settings.service";

@Component({
  selector: 'app-census-form-page',
  templateUrl: './census-form.page.html',
  styleUrls: ['./census-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FaIconComponent, IonButton, IonButtons, IonFab, IonFabButton, IonMenuButton, IonSegment, IonSegmentButton, RecordFormComponent, RecordPhotosComponent, IonFabList, IonIcon, RecordsListComponent, IonImg, IonLabel]
})
export class CensusFormPage implements OnInit {

  public DATASET_NAME_CENSUS = DATASET_NAME_CENSUS;
  public faCamera = faCamera;
  public faImage = faImage;
  public faSave = faSave;
  public faTrashCan = faTrashCan;

  segment: string = 'form';

  writeable$: Observable<boolean>;
  children$: Observable<ClientRecord[]>;

  dirty: boolean = false;

  constructor(
    private activeRecordService: ActiveRecordService,
    private alertController: AlertController,
    private photoService: CameraService,
    private navigationService: NavigationService,
    private recordsService: RecordsService,
    private settingsService: SettingsService,
    private loadingCtrl: LoadingController,
  ) {
    this.writeable$ = this.activeRecordService.writeable$;
    this.children$ = combineLatest([
      this.activeRecordService.record$,
      this.settingsService.values$,
    ]).pipe(
      map(([record, settings]) => {
        if (!record) return [];
        return this.recordsService.getChildRecords(record.client_id)
          .filter((record) => {
            return !settings.hideUploaded || !record.isUploaded();
          });
      }),
    );
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

  setDirty(dirty: boolean) {
    this.dirty = dirty;
  }

  doNewSurvey() {
    if (!this.dirty) {
      this.createNewSurvey();
      return;
    }

    this.alertController.create({
      header: 'Census Modified',
      message: 'Do you want to save the changes?',
      backdropDismiss: true,
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            await this.loadingCtrl.create();
            await this.activeRecordService.save()
            this.createNewSurvey();
          }
        },
        {
          text: 'No',
          handler: async () => {
            await this.loadingCtrl.create();
            this.createNewSurvey();
          }
        }
      ]
    }).then((alert) => alert.present());
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

  createNewSurvey() {
    const record = this.activeRecordService.getRecord();
    this.activeRecordService.clear({
      parentId: record.client_id,
      data: {
        "Census ID": record.client_id,
      },
    });
    this.navigationService.goSurvey();
  }
}
