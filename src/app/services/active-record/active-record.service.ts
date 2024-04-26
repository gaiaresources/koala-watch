import { Injectable } from '@angular/core';
import { ClientPhoto } from "../../models/client-photo";
import { BehaviorSubject } from "rxjs";
import { StorageService } from "../storage/storage.service";
import { UUID } from "angular2-uuid";


@Injectable({
  providedIn: 'root'
})
export class ActiveRecordService {

  public _clientId = new BehaviorSubject<string>("");
  public clientId$ = this._clientId.asObservable();

  private _values = new BehaviorSubject<any>({});
  public values$ = this._values.asObservable();

  public _status = new BehaviorSubject<string>("");
  public status$ = this._status.asObservable();

  private _photos = new BehaviorSubject<ClientPhoto[]>([]);
  public photos$ = this._photos.asObservable();

  private _currentPhoto = new BehaviorSubject<number>(0);
  public currentPhoto$ = this._currentPhoto.asObservable();

  constructor(private storageService: StorageService) {
  }

  clear() {
    this._values.next({});
    this._photos.next([]);
    this._status.next("");
    this._currentPhoto.next(0);
  }

  getClientId() {
    return this._clientId.value;
  }

  setClientId(clientId: string) {
    this._clientId.next(clientId);
  }

  getValues() {
    return this._values.value;
  }

  setValues(values: any) {
    this._values.next(values);
  }

  getStatus() {
    return this._status.value;
  }

  setStatus(status: string) {
    this._status.next(status);
  }

  getPhotos(): ClientPhoto[] {
    return this._photos.value;
  }

  setPhotos(photos: ClientPhoto[]) {
    this._photos.next(photos);
  }

  /**
   * Adds a photo to the active record, returns index.
   *
   * @param photo
   */
  addPhoto(photo: ClientPhoto) {
    const photos = this._photos.value;
    photos.push(photo);
    this._photos.next(photos);
    return photos.length - 1;
  }

  deletePhoto(index: number) {
    const photos = this._photos.value;
    photos.splice(index, 1);
    this._photos.next(photos);
    if (index >= photos.length) {
      this._currentPhoto.next(photos.length - 1);
    }
  }

  getCurrentPhoto(): number {
    return this._currentPhoto.value;
  }

  setCurrentPhoto(index: number) {
    this._currentPhoto.next(index);
  }

  save() {
    // TODO: Stores the active record into storage (which should list all the records of the user)
    // Once it is uploaded then it should display on the API.
    const record = {
      values: this._values.value,
      status: this._status.value,
      photos: this._photos.value,
      currentPhoto: this._currentPhoto.value
    };
    const key = UUID.UUID();
    this.storageService.store(key, record);
  }

}
