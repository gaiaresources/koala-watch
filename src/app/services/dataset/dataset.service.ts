import {Inject, Injectable} from '@angular/core';
import {AuthenticationService} from "../authentication/authentication.service";
import {APIService} from "../api/api.service";
import {PROJECT_NAME} from "../../tokens/app";
import {firstValueFrom, from, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {StorageService} from "../storage/storage.service";
import {Dataset} from "../../models/dataset";

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  private readonly DATASET_PREFIX = 'Dataset_';

  public datasets$: Observable<Dataset[]>;

  constructor(
    @Inject(PROJECT_NAME) private projectName: string,
    private authenticationService: AuthenticationService,
    private apiService: APIService,
    private storageService: StorageService,
  ) {
    this.datasets$ = this.authenticationService.loggedIn$
      .pipe(
        switchMap((status) => {
          // Not logged in, ensure dataset information not continued to be stored.
          if (!status) {
            return from(this.removeStoredDatasets());
          }
          // Logged in, ensure datasets either loaded from storage, or use API to load.
          return from(this.loadStoredDatasets());
        }),
        shareReplay(1),
      );
  }

  private async loadStoredDatasets(): Promise<Dataset[]> {
    const available = await this.storageService.hasPrefixed(this.DATASET_PREFIX);
    if (available) {
      const datasets = await this.storageService.getPrefixed(this.DATASET_PREFIX);
      return Object.values(datasets);
    }

    // Load from API and store them.
    const records = await firstValueFrom(this.apiService.getDatasets());
    return Promise.all(
      records.map((record) => this.storageService.store(`${this.DATASET_PREFIX}${record.id}`, record)),
    ).then(() => records);
  }

  private async removeStoredDatasets(): Promise<Dataset[]> {
    return this.storageService.getPrefixed(this.DATASET_PREFIX).then((records: any) => {
      return Promise.all(
        Object.keys(records).map((key) => this.storageService.remove(key))
      )
    }).then(() => []);
  }

  getDataset$(name: string): Observable<Dataset | null> {
    return this.datasets$.pipe(
      map(datasets => {
        const found = datasets.find(dataset => dataset.name === name);
        return found ? found : null;
      })
    );
  }

}
