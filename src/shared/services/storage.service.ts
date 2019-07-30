import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Dataset, User } from '../../biosys-core/interfaces/api.interfaces';
import { ClientPhoto, ClientRecord } from '../interfaces/mobile.interfaces';
import { from } from 'rxjs/observable/from';
import { filter, mergeMap } from 'rxjs/operators';
import { concat } from 'rxjs/observable/concat';

@Injectable()
export class StorageService {
    private static readonly DATASET_PREFIX = 'Dataset_';
    private static readonly RECORD_PREFIX = 'Record_';
    private static readonly PHOTO_PREFIX = 'Photo_';
    private static readonly SETTING_PREFIX = 'Setting_';

    constructor(private storage: Storage) {

    }

    public putTeamMembers(users: User[]): Observable<boolean> {
        return fromPromise(this.storage.set('Team Members', users));
    }

    public getTeamMembers(): Observable<User[]> {
        return fromPromise(this.storage.get('Team Members'));
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

    public updateRecordId(record: ClientRecord, id: number): Observable<boolean> {
        for (const photoId of record.photoIds) {
            this.getPhoto(photoId).subscribe(clientPhoto => {
                clientPhoto.record = id;
                this.putPhoto(clientPhoto).subscribe();
            });
        }

        record.id = id;
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

    public getUploadableRecords(): Observable<ClientRecord> {
        const validParentsObservable: Observable<ClientRecord> = this.getParentRecords().pipe(
            filter((record: ClientRecord) => record.valid && !record.id),
        );

        const validChildrenObservable: Observable<ClientRecord> = validParentsObservable.pipe(
            mergeMap((parentRecord: ClientRecord) => this.getChildRecords(parentRecord.client_id)),
        );

        return concat(validParentsObservable, validChildrenObservable);
    }

    public getAllUploadedRecords(): Observable<ClientRecord> {
        return new Observable(observer => {
            this.storage.forEach((value, key) => {
                if (!!value.id) {
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
        this.getRecord(key).subscribe(clientRecord => {
            if (clientRecord) {
                this.storage.forEach((storageValue, storageKey) => {
                    if (storageValue.parentId === clientRecord.client_id) {
                        from(storageValue.photoIds as string[]).pipe(
                            mergeMap( photoId => this.deletePhoto(photoId) )
                        ).subscribe();
                        this.storage.remove(storageKey);
                    }
                });
                from(clientRecord.photoIds).pipe(
                    mergeMap( photoId => this.deletePhoto(photoId) )
                ).subscribe();
            }
        });
        return fromPromise(this.storage.remove(`${StorageService.RECORD_PREFIX}${key}`));
    }

    public clearRecords(): Observable<void> {
        return fromPromise(this.storage.clear());
    }

    public putPhoto(clientPhoto: ClientPhoto): Observable<boolean> {
        return fromPromise(this.storage.set(`${StorageService.PHOTO_PREFIX}${clientPhoto.clientId}`, clientPhoto));
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
                if (key.startsWith(StorageService.PHOTO_PREFIX) && !value.id) {
                    observer.next(value);
                }
            }).then(value => {
                observer.complete();
            }, reason => {
                observer.error(reason);
            });
        });
    }

    public updatePhotoMediaId(clientPhoto: ClientPhoto, id: number): Observable<boolean> {
        clientPhoto.id = id;
        return this.putPhoto(clientPhoto);
    }

    public getSetting(key: string): Observable<string> {
        return fromPromise(this.storage.get(`${StorageService.SETTING_PREFIX}${key}`));
    }

    public putSetting(key: string, setting: string): Observable<boolean> {
        return fromPromise(this.storage.set(`${StorageService.SETTING_PREFIX}${key}`, setting));
    }

}
