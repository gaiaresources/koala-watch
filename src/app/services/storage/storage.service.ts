import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage-angular";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

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

}
