import { Injectable } from '@angular/core';
import { APIService } from "../api/api.service";
import { StorageService } from "../storage/storage.service";
import { DatasetService } from "../dataset/dataset.service";
import { combineLatest, from, map, Observable, of, switchMap } from "rxjs";
import { ClientRecord } from "../../models/client-record";
import { DATASET_NAME_OBSERVATION } from "../../tokens/app";

@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  records$: Observable<ClientRecord[]>;

  constructor(
    private apiService: APIService,
    private datasetService: DatasetService,
    private storageService: StorageService,
  ) {
    this.records$ = this.datasetService.datasets$.pipe(
      map(datasets => datasets ? datasets.find(d => d.name === DATASET_NAME_OBSERVATION) : null),
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
