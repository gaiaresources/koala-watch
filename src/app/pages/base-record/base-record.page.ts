import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonItemDivider,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import {RecordFormComponent} from '../../components/record-form/record-form.component';
import {RecordPhotosComponent} from '../../components/record-photos/record-photos.component';
import {BehaviorSubject, distinctUntilChanged, Observable, shareReplay} from 'rxjs';
import {ClientRecord} from '../../models/client-record';
import {Dataset} from '../../models/dataset';
import {RecordsService} from '../../services/records/records.service';
import {LoadingOptions} from '@ionic/angular';
import {NavigationService} from '../../services/navigation/navigation.service';
import {ActivePhotoService} from '../../services/active-photo/active-photo.service';
import {CameraService} from '../../services/camera/camera.service';
import {FabSlotComponent} from '../../components/fab-slot/fab-slot.component';
import {FabButtonComponent} from '../../components/fab-button/fab-button.component';
import {HeaderToolbarComponent} from '../../components/header-toolbar/header-toolbar.component';
import {Keyboard} from '@capacitor/keyboard';

@Component({
  selector: 'app-base-record',
  templateUrl: './base-record.page.html',
  styleUrls: ['./base-record.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonSegment, IonSegmentButton, RecordFormComponent, RecordPhotosComponent, FabSlotComponent, FabButtonComponent, HeaderToolbarComponent, IonButtons, IonButton, IonFooter, IonToolbar, IonItemDivider]
})
export class BaseRecordPage implements OnInit {

  @Input()
  isSurvey: boolean = false;

  @Input()
  title: string = '';

  @Input()
  dataset?: Dataset;

  @Input()
  countField: string = '';

  @Input()
  dateField: string = '';

  @Input()
  deleteHeader: string = '';

  @Input()
  deleteQuestion: string = '';

  @Output()
  onSegment = new EventEmitter<string>();

  @Output()
  onDirty = new EventEmitter<boolean>();

  @Output()
  onValid = new EventEmitter<boolean>();

  _segment = 'form';
  @Input()
  set segment(value: string) {
    if (this._segment !== value) {
      this._segment = value;
      this.onSegment.emit(value);
    }
  };

  get segment() {
    return this._segment;
  }

  @Input()
  set record(value: ClientRecord | null) {
    if (!value) {
      value = this.createRecord();
    }
    this._record.next(value);
    this.photoService.setRecord(value);
  }

  _record = new BehaviorSubject<ClientRecord | null>(null);
  record$: Observable<ClientRecord | null> = this._record.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1),
  );

  dirty: boolean = false;
  showFooter: boolean = true;

  constructor(
    private recordsService: RecordsService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navigationController: NavigationService,
    private zone: NgZone,
    private photoService: ActivePhotoService,
    private cameraService: CameraService,
  ) {
  }

  ngOnInit() {
    Keyboard.addListener('keyboardWillShow', info => {
      this.showFooter = false;
      if (document.activeElement) {
        document.activeElement.scrollIntoView({behavior: "smooth", block: "center"});
      }
    });
    Keyboard.addListener('keyboardWillHide', () => {
      this.showFooter = true;
    });
  }

  doValid(valid: boolean) {
    this.onValid.emit(valid);
  }

  doDirty(dirty: boolean) {
    this.dirty = dirty;
    this.onDirty.emit(dirty);
  }

  async doDelete() {
    const alert = await this.alertController.create({
      header: this.deleteHeader,
      message: this.deleteQuestion,
      backdropDismiss: true,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.zone.run(async () => {
              await this.doLoader();
              await this.doDeleteRecord();
            });
          }
        },
        {
          text: 'No'
        }
      ]
    });
    await alert.present();
  }

  async doLoader(options?: LoadingOptions) {
    const loader = await this.loadingController.create(options);
    await loader.present();
  }

  async doCompleted(record?: ClientRecord) {
    await this.loadingController.dismiss();
    if (this.isSurvey && record) {
      const parentRecord = this.recordsService.getRecord(record.parentId);
      if (parentRecord) {
        await this.navigationController.goSurveyRecords(parentRecord);
      }
    } else {
      await this.navigationController.goRecords();
    }
  }

  async doDeleteRecord() {
    const record = this._record.value;
    if (!record || !record.client_id) {
      return;
    }
    await this.recordsService.deleteRecord(record.client_id);
    await this.doCompleted();
  }

  async doSave() {
    const record = this._record.value;
    if (!record) {
      return;
    }

    await this.doLoader({
      message: 'Saving...',
    });
    await this.recordsService.setRecord(record);
    await this.photoService.save();
    await this.doCompleted(record);
  }

  public async shouldSave(): Promise<boolean> {
    if (!this.dirty) {
      return false;
    }

    return await new Promise((resolve, reject) => {
      this.alertController.create({
        header: 'Record Modified',
        message: 'Do you want to save the changes?',
        backdropDismiss: true,
        buttons: [
          {
            text: 'Yes',
            handler: async () => {
              resolve(true);
            }
          },
          {
            text: 'No',
            handler: () => {
              resolve(false);
            }
          }
        ]
      }).then((alert) => alert.present());
    });
  }

  async doCamera() {
    await this.cameraService.getCameraPhoto();
  }

  async doGallery() {
    await this.cameraService.getLibraryPhoto();
  }

  protected createRecord() {
    return new ClientRecord();
  }

}
