import { Inject, Injectable } from '@angular/core';
import { AuthenticationService } from "../authentication/authentication.service";
import { APIService } from "../api/api.service";
import { PROJECT_NAME } from "../../tokens/app";
import { distinctUntilChanged, map, Observable, of, shareReplay, switchMap } from "rxjs";
import { StorageService } from "../storage/storage.service";
import { Dataset } from "../../models/dataset";

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  public datasets$: Observable<Dataset[]>;

  constructor(
    @Inject(PROJECT_NAME) private projectName: string,
    private authenticationService: AuthenticationService,
    private apiService: APIService,
    private storageService: StorageService,
  ) {
    this.datasets$ = this.authenticationService.user$.pipe(distinctUntilChanged())
      .pipe(
        switchMap((user) => {
          if (!user) return of([]);
          return this.apiService.getDatasets();
        }),
        shareReplay(1),
      );
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
