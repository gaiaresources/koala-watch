import {Injectable} from '@angular/core';
import {APIService} from "../api/api.service";
import {BehaviorSubject, combineLatest, from, Observable, of, shareReplay, switchMap} from "rxjs";
import {ClientPhoto} from "../../models/client-photo";
import {NetworkService} from "../network/network.service";
import {tap} from "rxjs/operators";
import {ClientRecord} from "../../models/client-record";
import {PhotoService} from "../photo/photo.service";

export interface PhotoMap {
  [key: string]: ClientPhoto | null;
}

const matchPhoto = function (id: string) {
  return function (photo: ClientPhoto) {
    return photo.clientId && photo.clientId === id;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ActivePhotoService {
  private readonly PHOTO_PREFIX = 'Photo_';

  private _record = new BehaviorSubject<ClientRecord>(new ClientRecord());

  // List of all photos to be deleted.
  private _deletedPhotos = new BehaviorSubject<ClientPhoto[]>([]);

  // List of all photos to be added.
  private _addedPhotos = new BehaviorSubject<ClientPhoto[]>([]);

  // List of all photos for the active record.
  public photos$: Observable<ClientPhoto[]>;

  // The currently selected active photo.
  private _currentPhoto = new BehaviorSubject<number>(0);
  public currentPhoto$ = this._currentPhoto.asObservable();

  private added: boolean = false;

  constructor(
    private networkService: NetworkService,
    private apiService: APIService,
    private photoService: PhotoService,
  ) {
    this.photos$ = this._record.asObservable().pipe(
      switchMap((record) => {
        return combineLatest([
          this.getApiPhotos$(record.id),
          this.getStoredPhotos$(record.client_id),
          this._addedPhotos.asObservable(),
          this._deletedPhotos.asObservable(),
        ]).pipe(
          switchMap<[ClientPhoto[], ClientPhoto[], ClientPhoto[], ClientPhoto[]], Observable<ClientPhoto[]>>(
            ([
               apiPhotos,
               storedPhotos,
               addedPhotos,
               deletedPhotos
             ]): Observable<ClientPhoto[]> => {
              return from(
                this.getPhotoMap(
                  record.photoIds,
                  apiPhotos,
                  storedPhotos,
                  addedPhotos,
                  deletedPhotos
                )
              );
            }),
          tap((photos) => {
            const current = this._currentPhoto.value;
            if (photos.length && current >= photos.length) {
              this._currentPhoto.next(photos.length - 1);
            }
            if (this.added) {
              this.added = false;
              this._currentPhoto.next(photos.length - 1);
            }
          }),
          shareReplay(1),
        )
      }),
    );
  }

  setRecord(record: ClientRecord) {
    const existing = this._record.value;
    if (existing?.client_id === record?.client_id) return;
    this._record.next(record);
    this._addedPhotos.next([]);
    this._deletedPhotos.next([]);
  }

  /**
   * Adds a photo to the active record, returns index.
   *
   * @param photo
   */
  addPhoto(photo: ClientPhoto) {
    this.added = true;
    photo.recordClientId = this._record.value.client_id ?? "";
    const photos = this._addedPhotos.value;
    photos.push(photo);
    this._addedPhotos.next(photos);
  }

  deletePhoto(photo: ClientPhoto) {
    const photos = this._deletedPhotos.value;
    photos.push(photo);
    let added = this._addedPhotos.value;
    added = added.filter((p) => p.clientId !== photo.clientId);
    this._deletedPhotos.next(photos);
    this._addedPhotos.next(added);
  }

  getCurrentPhoto(): number {
    return this._currentPhoto.value;
  }

  setCurrentPhoto(index: number) {
    this._currentPhoto.next(index);
  }

  private getApiPhotos$(recordId: number | undefined): Observable<ClientPhoto[]> {
    if (!recordId) return of([]);
    return this.apiService.getRecordMedia(recordId.toString()).pipe(
      shareReplay(1),
    );
  }

  private getStoredPhotos$(recordId: string): Observable<ClientPhoto[]> {
    return from(this.photoService.getRecordPhotos(recordId)).pipe(
      shareReplay(1),
    );
  }

  private getPhotoMap(
    photoIds: string[],
    apiPhotos: ClientPhoto[],
    storedPhotos: ClientPhoto[],
    addedPhotos: ClientPhoto[],
    deletedPhotos: ClientPhoto[]
  ): Promise<ClientPhoto[]> {
    const isDeleted = (photo: ClientPhoto) => {
      return !!deletedPhotos.find(p => p.clientId === photo.clientId);
    };

    const photos: ClientPhoto[] = [];

    const updatePhotos: ClientPhoto[] = [];

    // Add the stored photos, updating the id if the client id matches the api version.
    storedPhotos.forEach((photo) => {
      if (isDeleted(photo)) return;

      let api = apiPhotos.find(matchPhoto(photo.clientId));
      if (api && !photo.id) {
        photo.id = api.id;
        updatePhotos.push(photo);
      }
      photos.push(photo);
    });

    // Add any uploaded API photos.
    apiPhotos.forEach((photo) => {
      if (isDeleted(photo)) return;
      if (storedPhotos.find(matchPhoto(photo.clientId))) return;

      updatePhotos.push(photo);
      photos.push(photo);
    });

    // Perform storage update of all updated photos.
    const promise = updatePhotos.length > 0 ?
      Promise.all(updatePhotos.map(photo => this.photoService.setPhoto(photo))) :
      Promise.resolve();

    // Return the combined photo list.
    return promise.then(() => photos.concat(addedPhotos));
  }

  async save() {
    const promises: Promise<void>[] = [];

    const addedPhotos = this._addedPhotos.value;
    addedPhotos.forEach(photo => promises.push(this.photoService.setPhoto(photo)));

    const deletedPhotos = this._deletedPhotos.value;
    deletedPhotos.forEach(photo => promises.push(this.photoService.removePhoto(photo.clientId)));

    await Promise.all(promises);
  }

}
