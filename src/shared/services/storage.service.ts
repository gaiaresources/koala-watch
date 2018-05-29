import { Storage } from '@ionic/storage';
import { Record } from '../../biosys-core/interfaces/api.interfaces';
import { UUID } from 'angular2-uuid'
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { fromPromise } from 'rxjs/observable/fromPromise';

@Injectable()
export class StorageService {
    constructor(private storage: Storage) {
    }

    public putRecord(record: Record): Observable<boolean> {
        const key = UUID.UUID();
        let thePromise: Promise<any>;
        thePromise = this.storage.set(key, record);
        return fromPromise(thePromise);
    }

    public getRecords(pickCriteria?): Observable<Record> {
        return new Observable(observer => {
            this.storage.forEach((value: Record, key) => {
                if (pickCriteria === undefined || pickCriteria(value, key)) {
                    if (value === undefined) {
                        return;
                    }
                    value.data['uuid'] = key;
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
        let thePromise: Promise<any>;
        thePromise = this.storage.remove(key);
        return fromPromise(thePromise);
    }

    public clearRecords(): Observable<boolean> {
        let thePromise: Promise<any>;
        thePromise = this.storage.clear();
        return fromPromise(thePromise);
    }
}
