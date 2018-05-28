import { Storage } from "@ionic/storage";
import { Record } from "./biosys-core/interfaces/api.interfaces";
import { UUID } from 'angular2-uuid'
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {
    constructor(private storage: Storage) {
    }
  
    public putRecord(record: Record): Observable<boolean> {
        return new Observable(observer => {
            let uuid = UUID.UUID();
            //let key = 'Record_' + uuid;
            let key = uuid;
            this.storage.set(key, record).then(ok => {
                observer.next(true);
                observer.complete();
            }, notOK => {
            observer.next(false);
            observer.complete();
            });
        })
    }
  
    public getRecords(pickCriteria = undefined): Observable<Record> {
        return new Observable(observer => {
            this.storage.forEach((value: Record, key) => {
            if (pickCriteria === undefined || pickCriteria(value, key)) {
                if (value === undefined)
                    return;
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
  
    public patchRecord(record: Record, key: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.storage.set(key, record).then(ok => {
                observer.next(true);
                observer.complete();
            }, notOK => {
                observer.next(false);
                observer.complete();
            })
        });
    }
  
    public deleteRecord(key: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.storage.remove(key).then(
            ok => {
                observer.next(true);
                observer.complete();
            },
            bad => {
                observer.next(false);
                observer.complete();
            })
        });
    }
  
    public clearRecords(): Observable<boolean> {
        return new Observable<boolean>(observer => {
            this.storage.clear().then(ok => {
                observer.next(true);
                observer.complete();
            }, bad => {
                observer.next(false);
                observer.complete();
            });
        })
    }
}
