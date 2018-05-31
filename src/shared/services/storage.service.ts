import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid'
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Dataset, Record } from "../../biosys-core/interfaces/api.interfaces";

@Injectable()
export class StorageService {
    constructor(private storage: Storage) {
    }
    
    private Label_Dataset='Dataset';
    private Label_Record='Record';
    
    public putDataset(dataset: Dataset): Observable<boolean> {
        const key = this.Label_Dataset + "_" + dataset.id;
        return fromPromise(this.storage.set(key, dataset));
    }
    
    public getDatasets(pickCriteria=undefined) : Observable<Dataset> {
        return new Observable( observer => {
            this.storage.forEach((value, key) => {
                if (key.split('_')[0] === this.Label_Dataset)
                    if (pickCriteria == undefined || pickCriteria(value, key))
                        observer.next(value);
            }).then( value => {
                observer.complete();
            }, reason => {
                observer.error(reason);
            });
        });
    }
  
    public putRecord(record: Record): Observable<boolean> {
        const key = this.Label_Record + "_"  + UUID.UUID();
        return fromPromise(this.storage.set(key, record));
    }
    
    public getRecord(key: string): Observable<Record> {
        return fromPromise(this.storage.get(this.Label_Record + "_" + key));
    }
    
    public getRecords(pickCriteria = undefined): Observable<Record> {
        return new Observable(observer => {
            this.storage.forEach((value: Record, key) => {
                if (key.split('_')[0] === this.Label_Dataset)
                    if (pickCriteria === undefined || pickCriteria(value, key)) {
                        if (value === undefined)
                            return;
                        if (value.data === undefined)
                            value.data = {};
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
        return fromPromise(this.storage.remove(key));
    }

    public clearRecords(): Observable<boolean> {
        let thePromise: Promise<any>;
        thePromise = this.storage.clear();
        return fromPromise(thePromise);
    }
}
