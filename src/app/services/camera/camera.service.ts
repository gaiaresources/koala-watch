import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, ImageOptions} from "@capacitor/camera";
import {UUID} from "angular2-uuid";
import * as dayjs from "dayjs";
import {ClientPhoto} from "../../models/client-photo";
import {ActivePhotoService} from "../active-photo/active-photo.service";

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private activePhotoService: ActivePhotoService) {
  }

  public async getCameraPhoto() {
    return this.getPhoto(CameraSource.Camera);
  }

  public async getLibraryPhoto() {
    return this.getPhoto(CameraSource.Photos);
  }

  private getPhoto(source: CameraSource) {
    const options: ImageOptions = {
      source: source,
      quality: 100,
      width: 1024,
      height: 1024,
      resultType: CameraResultType.DataUrl,
      correctOrientation: true
    };

    return Camera.getPhoto(options).then((photo) => {
      const base64 = photo.dataUrl;
      if (base64) {
        const id = UUID.UUID();
        return this.activePhotoService.addPhoto(new ClientPhoto({
          clientId: id,
          datetime: dayjs().format(),
          fileName: id + ".jpg",
          recordClientId: "",
          base64: base64,
        }));
      }

      return 0;
    }).catch((err) => {
      console.log('camera error', err);
      // TODO: Handle the proper user response to either cancelling taking the photo
      // or some other issue.
    });
  }
}
