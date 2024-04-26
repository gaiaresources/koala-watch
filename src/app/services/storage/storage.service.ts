import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage-angular";
import { ClientRecord } from "../../models/client-record";
import { filter, Observable } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static readonly RECORD_PREFIX = 'Record_';

  private _storage: Storage | null = null;

  private list: any[] = [];

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

  public updateRecordId(record: ClientRecord, id: number): Observable<boolean> {
    // for (const photoId of record.photoIds) {
    //   this.getPhoto(photoId).subscribe(clientPhoto => {
    //     clientPhoto.record = id;
    //     this.putPhoto(clientPhoto).subscribe();
    //   });
    // }

    record.id = id;
    return this.putRecord(record);
  }


  public getUploadableRecords() {
    return this.getParentRecords();
  }

  public getParentRecords() {
    var promise = new Promise((resolve, reject) => {
      this.storage.forEach((value, key, index) => {
        if (key.startsWith(StorageService.RECORD_PREFIX) && !value.parentId) {
          this.list.push(value);
        }
      }).then((d) => {
        resolve(this.list);
      });
    });
    return promise;
  }

  // I'm so sorry, I couldn't figure it out.
  public getAllRecords() {
    var promise = new Promise((resolve, reject) => {
      this.storage.forEach((value, key, index) => {
        this.list.push(value);
      }).then((d) => {
        resolve(this.list);
      });
    });
    return promise;
  }

}
