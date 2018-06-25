import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { ClientPhoto, ClientRecord } from '../interfaces/mobile.interfaces';

@Injectable()
export class StorageService {
    private static readonly DATASET_PREFIX = 'Dataset_';
    private static readonly RECORD_PREFIX = 'Record_';
    private static readonly PHOTO_PREFIX = 'Photo_';

    constructor(private storage: Storage) {

    }

    public putDataset(dataset: Dataset): Observable<boolean> {
        return fromPromise(this.storage.set(`${StorageService.DATASET_PREFIX}${dataset.name}`, dataset));
    }

    public getDataset(key: string): Observable<Dataset> {
        return fromPromise(this.storage.get(`${StorageService.DATASET_PREFIX}${key}`));
    }

    public getAllDatasets(): Observable<Dataset> {
        return new Observable(observer => {
            this.storage.forEach((value, key) => {
                if (key.startsWith(StorageService.DATASET_PREFIX)) {
                    observer.next(value);
                }
            }).then(value => {
                observer.complete();
            }, reason => {
                observer.error(reason);
            });
        });
    }

    public putRecord(record: ClientRecord): Observable<boolean> {
        return fromPromise(this.storage.set(`${StorageService.RECORD_PREFIX}${record.client_id}`, record));
    }

    public getRecord(key: string): Observable<ClientRecord> {
        return fromPromise(this.storage.get(`${StorageService.RECORD_PREFIX}${key}`));
    }

    public updateRecordServerId(record: ClientRecord, serverId: number): Observable<boolean> {
        for (const photoId of record.photoIds) {
            this.getPhoto(photoId).subscribe(clientPhoto => {
                clientPhoto.recordServerId = serverId;
                this.putPhoto(clientPhoto.id, clientPhoto).subscribe();
            });
        }

        record.serverId = serverId;
        return this.putRecord(record);
    }

    public getParentRecords(): Observable<ClientRecord> {
        return new Observable(observer => {
            this.storage.forEach((value, key) => {
                if (key.startsWith(StorageService.RECORD_PREFIX) && !value.parentId) {
                    observer.next(value);
                }
            }).then(value => {
                observer.complete();
            }, reason => {
                observer.error(reason);
            });
        });
    }

    public getAllValidRecords(): Observable<ClientRecord> {
        return new Observable(observer => {
            this.storage.forEach((value, key) => {
                if (key.startsWith(StorageService.RECORD_PREFIX) && value.valid && !value.serverId) {
                    observer.next(value);
                }
            }).then(value => {
                observer.complete();
            }, reason => {
                observer.error(reason);
            });
        });
    }

    public getChildRecords(parentId: string): Observable<ClientRecord> {
        return new Observable(observer => {
            this.storage.forEach((value, key) => {
                if (key.startsWith(StorageService.RECORD_PREFIX) && value.parentId === parentId) {
                    observer.next(value);
                }
            }).then(value => {
                observer.complete();
            }, reason => {
                observer.error(reason);
            });
        });
    }

    public deleteRecord(key: string): Observable<boolean> {
        return fromPromise(this.storage.remove(`${StorageService.RECORD_PREFIX}${key}`));
    }

    public clearRecords(): Observable<void> {
        return fromPromise(this.storage.clear());
    }

    public putPhoto(key: string, clientPhoto: ClientPhoto): Observable<boolean> {
        return fromPromise(this.storage.set(`${StorageService.PHOTO_PREFIX}${key}`, clientPhoto));
    }

    public getPhoto(key: string): Observable<ClientPhoto> {
        return fromPromise(this.storage.get(`${StorageService.PHOTO_PREFIX}${key}`));
    }

    public deletePhoto(key: string): Observable<boolean> {
        return fromPromise(this.storage.remove(`${StorageService.PHOTO_PREFIX}${key}`));
    }

    public getAllPendingPhotos(): Observable<ClientPhoto> {
        return new Observable(observer => {
            this.storage.forEach((value, key) => {
                if (key.startsWith(StorageService.PHOTO_PREFIX) && value.recordServerId && !value.serverId) {
                    observer.next(value);
                }
            }).then(value => {
                observer.complete();
            }, reason => {
                observer.error(reason);
            });
        });
    }

    public updatePhotoRecordServerId(clientPhoto: ClientPhoto, recordServerId: number): Observable<boolean> {
        clientPhoto.recordServerId = recordServerId;
        return this.putPhoto(clientPhoto.id, clientPhoto);
    }

    public updatePhotoMediaId(clientPhoto: ClientPhoto, mediaId: number): Observable<boolean> {
        clientPhoto.mediaId = mediaId;
        return this.putPhoto(clientPhoto.id, clientPhoto);
    }

}
