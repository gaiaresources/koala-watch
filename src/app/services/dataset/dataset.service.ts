import {Inject, Injectable} from '@angular/core';
import {AuthenticationService} from "../authentication/authentication.service";
import {APIService} from "../api/api.service";
import {DATASET_OVERRIDES, PROJECT_NAME} from "../../tokens/app";
import {BehaviorSubject, combineLatest, firstValueFrom, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {StorageService} from "../storage/storage.service";
import {Dataset} from "../../models/dataset";
import {User} from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class DatasetService {
  private readonly DATASET_PREFIX = 'Dataset_';

  private _dataset = new BehaviorSubject<Dataset[]>([]);
  public datasets$: Observable<Dataset[]>;

  private _user?: User | null;

  constructor(
    @Inject(PROJECT_NAME) private projectName: string,
    private authenticationService: AuthenticationService,
    private apiService: APIService,
    private storageService: StorageService,
    @Inject(DATASET_OVERRIDES) private datasetOverrides: any,
  ) {
    this.datasets$ = combineLatest([
      this.authenticationService.loggedIn$,
      this._dataset.asObservable(),
    ]).pipe(
      switchMap(([status, datasets]) => {
        if (!status) return of([]);
        return of(datasets);
      }),
      shareReplay(1),
    );

    this.authenticationService.user$.subscribe(async (user) => {
      if (this._user !== undefined) {
        await this.removeStoredDatasets();
      }
      this._user = user;

      if (!user) {
        await this.removeStoredDatasets()
        this._dataset.next([]);
      } else {
        const datasets = await this.loadStoredDatasets();
        this._dataset.next(datasets);
      }
    });
  }

  private overrideDatasets(datasets: Dataset[]) {
    const merge = (a: any, b: any) => {
      for (const key of Object.keys(b)) {
        if (!a.hasOwnProperty(key) || typeof b[key] !== 'object') {
          a[key] = b[key];
        } else {
          merge(a[key], b[key]);
        }
      }
    };

    datasets.forEach(dataset => {
      if (!dataset.name) return;
      if (!this.datasetOverrides.hasOwnProperty(dataset.name)) return;
      const overrides = this.datasetOverrides[dataset.name];

      overrides.forEach((override: any, index: number) => {
        if (!override) return;
        dataset.data_package.resources[index].schema.fields.forEach((record: any) => {
          if (!override.hasOwnProperty(record.name)) return;
          merge(record, override[record.name]);
        });
      });
    });
    return datasets;
  }

  private async loadStoredDatasets(): Promise<Dataset[]> {
    const available = await this.storageService.hasPrefixed(this.DATASET_PREFIX);
    if (available) {
      const datasets = await this.storageService.getPrefixed(this.DATASET_PREFIX);
      return this.overrideDatasets(Object.values(datasets));
    }

    // Load from API and store them.
    const records = await firstValueFrom(this.apiService.getDatasets());
    return Promise.all(
      records.map((record) => this.storageService.store(`${this.DATASET_PREFIX}${record.id}`, record)),
    ).then(() => this.overrideDatasets(records));
  }

  private async removeStoredDatasets(): Promise<Dataset[]> {
    return this.storageService.getPrefixed(this.DATASET_PREFIX).then((records: any) => {
      return Promise.all(
        Object.keys(records).map((key) => this.storageService.remove(`${this.DATASET_PREFIX}${key}`))
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
