import { Injectable } from '@angular/core';
import { APIService } from "../api/api.service";
import { BehaviorSubject, combineLatest, from, map, of, switchMap } from "rxjs";
import { StorageService } from "../storage/storage.service";
import { DatasetService } from "../dataset/dataset.service";
import { ClientRecord } from "../../models/client-record";

@Injectable({
  providedIn: 'root'
})
export class RecordsService {

  private _records = new BehaviorSubject<ClientRecord[]>([]);
  public records$ = this._records.asObservable();

  constructor(
    private apiService: APIService,
    private storageService: StorageService,
    private datasetService: DatasetService,
  ) {
  }

  getObservationRecords$() {
  }

  getCensusRecords$() {

  }

  getSurveyRecords$() {

  }

  getRecordsByName$(name: string) {
    return this.datasetService.datasets$.pipe(
      map(datasets => datasets ? datasets.find(d => d.name === name) : null),
      switchMap(dataset => {
        if (!dataset) return of([]);

        return combineLatest([
          this.apiService.getRecordsByDatasetId(dataset.id),
          from(this.storageService.getPrefixed('Record_')),
        ]).pipe(
          map(([apiRecords, storageRecords]) => {
            console.log('api records', apiRecords);
            console.log('storage Records', storageRecords);
            return of([]);
          }),
        );
      }),
    );
  }

}
