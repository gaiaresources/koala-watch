import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage-angular";
import { ClientRecord } from "../../models/client-record";
import { filter, from, map, Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static readonly RECORD_PREFIX = 'Record_';

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public store(key: string, value: any): Promise<any> {
    if (!this._storage) return Promise.reject();
    return this._storage.set(key, value);
  }

  public load(key: string): Promise<any> {
    if (!this._storage) return Promise.reject();
    return this._storage.get(key);
  }

  public remove(key: string): Promise<void> {
    if (!this._storage) return Promise.reject();
    return this._storage.remove(key);
  }

  /**
   * Get all the prefixed values.
   *
   * @param prefix
   */
  public getPrefixed(prefix: string): Promise<any> {
    if (!this._storage) return Promise.reject();

    const values: any = {};
    const length = prefix.length;
    return this._storage.forEach((value, key) => {
      if (key.startsWith(prefix)) values[key.slice(length)] = value;
    }).then(() => values);
  }

  public putRecord(record: ClientRecord): Observable<boolean> {
    return fromPromise(this.storage.set(`${StorageService.RECORD_PREFIX}${record.client_id}`, record));
  }

  public getUploadableRecords(): Observable<ClientRecord> {
    const validParentsObservable: Observable<ClientRecord> = this.getParentRecords().pipe(
      filter((record: ClientRecord) => record.valid && !record.id),
    );

    return validParentsObservable;

      // this.getParentRecords().pipe(
      // map((record: ClientRecord) => record)
      // filter((record: ClientRecord) => record.valid && !record.id),
    // );

    // return validParentsObservable;
    // const validChildrenObservable: Observable<ClientRecord> = validParentsObservable.pipe(
    //   mergeMap((parentRecord: ClientRecord) => this.getChildRecords(parentRecord.client_id)),
    // );

    // return concat(validParentsObservable, validChildrenObservable);
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

}
