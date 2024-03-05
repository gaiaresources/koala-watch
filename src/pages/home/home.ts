import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, NavParams, IonTabs, ToastController } from '@ionic/angular';

import { ClientRecord } from '../../shared/interfaces/mobile.interfaces';
import { APIError } from '../../biosys-core/interfaces/api.interfaces';
import { StorageService } from '../../shared/services/storage.service';
import { UploadService } from '../../shared/services/upload.service';
import {
  DATASET_NAME_CENSUS,
  DATASET_NAME_OBSERVATION,
  TOAST_DURATION
} from '../../shared/utils/consts';
import { isDatasetCensus } from '../../shared/utils/functions';
import { filter } from "rxjs";
import {list} from "ionicons/icons";
import {EventService} from "../../shared/services/event.service";
import {Router} from "@angular/router";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styleUrls: ['home.scss']
})
export class HomePage implements OnInit {

  public records: ClientRecord[];

  private loading?: HTMLIonLoadingElement;

  // consts used in template
  public DATASETNAME_CENSUS = DATASET_NAME_CENSUS;
  public DATASETNAME_OBSERVATION = DATASET_NAME_OBSERVATION;

  @ViewChild('homeTabs') tabRef: IonTabs;

  @ViewChild('myFabUpload') fabUpload: any;

  public isMapTabSelected = false;

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private storageService: StorageService,
    private uploadService: UploadService, private event: EventService, private router: Router
  ) {
    this.records = [];
  }

  /**
   * Lifecycle method called by system
   */
  ionViewWillEnter() {
    console.log("Testing - Home ionViewWillEnter ran")
    this.loadRecords();
    this.event.publishEvent('home-willenter');
    this.event.getObservableForEvent('upload-clicked').subscribe(() => this.clickedUpload());
  }

  async clickedUpload() {
    console.log("Testing - Clicked upload")
    if (this.records.length <= 0) {
      // Disable this button if there are no records to prevent an issue
      // where the spinner remains indefinitely.
      console.log("Testing - Returning as no records")
      return;
    }

    this.loading = await this.loadingCtrl.create({
        message: 'Uploading records'
    });
    await this.loading.present();
    this.uploadService.uploadValidRecords().subscribe({
      error: (error: APIError) => {
        this.loading?.dismiss();

        this.toastCtrl.create({
          message: `Some records failed to upload: ${error.msg}`,
          duration: TOAST_DURATION,
          cssClass: 'toast-message'
        }).then((toast) => {
          toast.present
        });


        this.uploadService.uploadPendingRecordPhotos().subscribe();
        this.loadRecords();
      },
      complete: () => {
        this.loading?.dismiss();
        this.toastCtrl.create({
          message: 'Records uploaded successfully',
          duration: TOAST_DURATION,
          cssClass: 'toast-message'
        }).then((toast) => {
            toast.present
        });

        this.uploadService.uploadPendingRecordPhotos().subscribe();
        this.loadRecords();
      }
    });
  }

  public onClickedNewRecord(datasetName: string) {
    console.log("Testing - On Clicked new record")
    const page = isDatasetCensus(datasetName) ? '/census' : '/observation';
    this.router.navigateByUrl(page, { state: { datasetName: datasetName } })
  }

  public setMapTabSelected(value: boolean) {
    this.isMapTabSelected = value;
  }

  private loadRecords() {
    console.log("Testing - Called loadRecords")
    while (this.records.length) {

      console.log("Testing - popping records")
      this.records.pop();
    }
    this.storageService.getSetting('hideUploaded').subscribe(hideUploaded => {
      console.log("Testing - got hideUploaded")
      if (JSON.parse(hideUploaded)) {
        console.log("Testing - Getting parent records with pipe")
        this.storageService.getParentRecords().pipe(filter(record => !(!!record.id))).subscribe(
          (record: ClientRecord) => {
            console.log("Testing - Got client record")
            this.records.push(record)
          });
      } else {
        console.log("Testing - Getting parent records without pipe")
        this.storageService.getParentRecords().subscribe(
          (record: ClientRecord) => {
            console.log("Testing - Got client record")
            this.records.push(record)
          });
      }
    });

  }

  ngOnInit(): void {

    console.log("Testing - ngOnInit for Home called")

    setTimeout(() => {
      // These are needed to fix the app when used with a screenreader. Otherwise,
      // ionic adds a close-icon, which manifests itself as the screenreader saying
      // Close <title of button> button.

      if (document.getElementById('myFabUpload') !== null
        && document.getElementById('myFabUpload') !== undefined) {
        let fabUp = document.getElementById('myFabUpload');
        let fabUpIn = fabUp?.children.item(0);
        let fabStuff = fabUpIn?.children;
        let fabDelete = fabStuff?.namedItem('close');
        if (fabDelete) {
          fabDelete.remove();
        }
        fabUp = document.getElementById('myFabObo');
        fabUpIn = fabUp?.children.item(0);
        fabStuff = fabUpIn?.children;
        fabDelete = fabStuff?.namedItem('close');
        if (fabDelete) {
          fabDelete.remove();
        }
        fabUp = document.getElementById('myFabTree');
        fabUpIn = fabUp?.children.item(0);
        fabStuff = fabUpIn?.children;
        fabDelete = fabStuff?.namedItem('close');
        if (fabDelete) {
          fabDelete.remove();
        }
      }
    }, 500);
  }

  protected readonly list = list;
  protected readonly top = top;
}
