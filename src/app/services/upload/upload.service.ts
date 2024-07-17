import {Injectable} from '@angular/core';
import {firstValueFrom} from "rxjs";
import {APIService} from "../api/api.service";
import {RecordsService} from "../records/records.service";
import {PhotoService} from "../photo/photo.service";
import {AlertController, LoadingController} from "@ionic/angular/standalone";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private apiService: APIService,
    private recordsService: RecordsService,
    private photoService: PhotoService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
  }

  async upload() {
    const promises: Promise<any>[] = [];
    await this.loadingCtrl.create({
      message: "Uploading records",
    });


    // Generate promises to upload, then update the storage with the newly created ID.
    const records = this.recordsService.getUploadableRecords();
    records.forEach((record) => {
      delete record.modified;
      return firstValueFrom(this.apiService.createRecord(record)).then((result) => {
        if (result && result.id) {
          record.id = result.id;
          return this.recordsService.setRecord(record);
        }
        return;
      });
    })

    // Generate promises to upload, then update the storage with the newly created id.
    const photos = await this.photoService.getUploadablePhotos();
    photos.forEach((photo) => {
      const record = this.recordsService.getRecord(photo.recordClientId);
      if (!record || !record.id) return;
      return firstValueFrom(this.apiService.uploadRecordMediaBase64(record.id, photo.base64)).then((result) => {
        if (result && result.id) {
          photo.id = result.id;
          return this.photoService.setPhoto(photo);
        }
        return;
      });
    })

    await Promise.all(promises);

    await this.loadingCtrl.dismiss();
    const alert = await this.alertCtrl.create({
      message: "Records uploaded"
    });
    await alert.present;
  }

}
