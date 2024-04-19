import { Injectable } from '@angular/core';
import { StorageService } from "../storage/storage.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private values = new BehaviorSubject<any>({
    'hideUploaded': true,
  });
  public values$ = this.values.asObservable();

  constructor(private storageService: StorageService) {
    this.storageService.getPrefixed('Setting_')?.then((list) => {
      this.values.next(list);
    });
  }

  get(key: string) {
    const values = this.values.value;
    return values['Setting_' + key];
  }

  set(key: string, value: any) {
    const values = this.values.value;
    values[key] = value;
    return this.storageService.store('Setting_' + key, value)?.then(() => {
      this.values.next(values);
    });
  }
}
