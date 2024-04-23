import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { StorageService } from "../storage/storage.service";
import { APIService } from "../api/api.service";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private storageService: StorageService,
    private apiService: APIService,
  ) {
  }

  upload(): Observable<object| null> {
    this.storageService.getUploadableRecords().then((clientRecord) => {
      if (Array.isArray(clientRecord)) {
        clientRecord.forEach(record => {
          this.apiService.createRecord(record).subscribe(data => console.log(data))
        })
      }
    });
    return of();
  }

}
