import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor() {
  }

  upload(): Observable<void> {
    return of();
  }

}
