import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid'
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Dataset } from '../../biosys-core/interfaces/api.interfaces';
import { ClientRecord } from '../interfaces/mobile.interfaces';

@Injectable()
export class StorageService {
    private static readonly DATASET_PREFIX = 'Dataset_';
    private static readonly RECORD_PREFIX = 'Record_';

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

    public getAllRecords(): Observable<ClientRecord> {
        return new Observable(observer => {
            this.storage.forEach((value, key) => {
                if (key.startsWith(StorageService.RECORD_PREFIX)) {
                    observer.next(value);
                }
            }).then(value => {
                observer.complete();
            }, reason => {
                observer.error(reason);
            });
        });
    }

    public getAllValidRecords(): Observable<ClientRecord[]> {
        return new Observable(observer => {
            const records: ClientRecord[] = [];
            this.storage.forEach((value, key) => {
                if (key.startsWith(StorageService.RECORD_PREFIX) && value.valid) {
                    records.push(value);
                }
                observer.next(records);
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
}
