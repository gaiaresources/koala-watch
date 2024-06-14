import {Injectable} from '@angular/core';
import {ClientPhoto} from "../../models/client-photo";
import {StorageService} from "../storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private readonly PHOTO_PREFIX = 'Photo_';

  constructor(
    private storageService: StorageService,
  ) {
  }

  getRecordPhotos(recordId: string) {
    return this.storageService.getPrefixed(this.PHOTO_PREFIX).then((results) => {
      const photos = [];
      for (let key in results) {
        if (results[key].recordClientId === recordId) {
          photos.push(new ClientPhoto(results[key]));
        }
      }
      return photos;
    });
  }

  setPhoto(photo: ClientPhoto) {
    return this.storageService.store(`${this.PHOTO_PREFIX}${photo.clientId}`, photo);
  }

  getPhoto(clientId: string) {
    return this.storageService.load(`${this.PHOTO_PREFIX}${clientId}`).then((data) => {
      return new ClientPhoto(data);
    });
  }

  removePhoto(clientId: string) {
    return this.storageService.remove(`${this.PHOTO_PREFIX}${clientId}`);
  }

  public getUploadablePhotos(): Promise<ClientPhoto[]> {
    return this.storageService.getPrefixed(this.PHOTO_PREFIX).then((results) => {
      const photos: ClientPhoto[] = [];
      for (let key in results) {
        if (!results[key].id) {
          photos.push(results[key]);
        }
      }
      return photos;
    });
  }

}
