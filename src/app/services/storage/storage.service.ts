import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage-angular";

export interface StorageItem {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
  }

  async loaded(): Promise<Storage> {
    if (!this._storage) {
      this._storage = await this.storage.create();
    }
    return Promise.resolve(this._storage);
  }

  public async store(key: string, value: any): Promise<void> {
    const storage = await this.loaded();
    await storage.set(key, value);
  }

  public async load(key: string): Promise<any> {
    const storage = await this.loaded();
    return await storage.get(key);
  }

  public async remove(key: string): Promise<void> {
    const storage = await this.loaded();
    await storage.remove(key);
  }

  /**
   * Get all the prefixed values.
   *
   * @param prefix
   */
  public async getPrefixed(prefix: string): Promise<StorageItem> {
    const storage = await this.loaded();

    const values: any = {};
    const length = prefix.length;
    return await storage.forEach((value, key) => {
      if (key.startsWith(prefix)) values[key.slice(length)] = value;
    }).then(() => values);
  }

  /**
   * Check if any prefixed values exist.
   *
   * @param prefix
   */
  public async hasPrefixed(prefix: string): Promise<boolean> {
    const storage = await this.loaded();

    let found = false;
    return await storage.forEach((value, key) => {
      if (key.startsWith(prefix)) found = true;
    }).then(() => found);
  }

}
