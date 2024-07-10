import {Injectable} from '@angular/core';
import {APIService} from "../api/api.service";
import {StorageService} from "../storage/storage.service";
import {ClientRecord} from "../../models/client-record";
import {BehaviorSubject, combineLatest, firstValueFrom, from, map, Observable, shareReplay, switchMap} from "rxjs";
import {NetworkService} from "../network/network.service";
import {DatasetService} from "../dataset/dataset.service";
import {Dataset} from "../../models/dataset";
import {PhotoService} from "../photo/photo.service";

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private readonly RECORD_PREFIX = 'Record_';

  private records = new Map<string, ClientRecord>();

  private _changed = new BehaviorSubject<boolean>(false);
  public changed$ = this._changed.asObservable();

  private _loaded = new BehaviorSubject<void>(undefined);
  public loaded$ = this._loaded.asObservable().pipe(shareReplay(1));

  constructor(
    private apiService: APIService,
    private datasetService: DatasetService,
    private storageService: StorageService,
    private networkService: NetworkService,
    private photoService: PhotoService,
  ) {
    this.loadRecordsFromAPI();

    // When the network changes ensure that any discrepancies are fixed.
    this.networkService.status$.subscribe((changes) => {
      if (changes) this.loadRecordsFromAPI();
    });

    // Load the records and photos from storage.
    this.storageService.getPrefixed(this.RECORD_PREFIX).then((records) => {
      for (let key in records) {
        this.records.set(key, new ClientRecord(records[key]));
      }
      this._loaded.next();
      this._changed.next(true);
    });
  }

  private loadRecordsFromAPI() {
    const loader = combineLatest([
      this.datasetService.datasets$,
      this.apiService.getRecords(),
    ]).pipe(
      switchMap<[Dataset[], ClientRecord[]], Observable<boolean>>(
        ([datasets, records]) => {
          // Process all the datasets as promises.
          const promises = Promise.all(
            datasets.map(dataset => this.processDataset(
              records.filter(r => r.dataset === dataset.id))
            )
          );
          return from(promises.then(results => results.includes(true)));
        }
      )
    );

    // Load from the API, trigger if any dataset required updating.
    firstValueFrom(loader).then(changed => {
      if (changed) this._changed.next(true);
    });
  }

  private processDataset(records: ClientRecord[]): Promise<boolean> {
    return Promise.all(
      // This should return true if either a record was added from the API or the
      // API id was updated.
      records.map((value): Promise<boolean> => {
        if (this.records.has(value.client_id)) {
          return this.updateRecordId(value);
        }
        return this.setStoredRecord(value).then(() => true);
      })
    ).then((results) => results.includes(true));
  }

  private updateRecordId(value: ClientRecord): Promise<boolean> {
    const record = this.records.get(value.client_id);
    if (record && !record.id && value.id) {
      record.id = value.id;
      this.records.set(record.client_id, record);
      return this.setStoredRecord(record).then(() => true);
    }
    return Promise.resolve(false);
  }

  private setStoredRecord(record: ClientRecord) {
    return this.storageService.store(`${this.RECORD_PREFIX}${record.client_id}`, record);
  }

  private removeStoredRecord(recordId: string) {
    return this.storageService.remove(`${this.RECORD_PREFIX}${recordId}`);
  }

  getAllRecords() {
    return Array.from(this.records.values());
  }

  getRecords(dataset: string) {
    const records: ClientRecord[] = [];
    this.records.forEach((value) => {
      if (value.datasetName === dataset) {
        records.push(value);
      }
    });
    return records;
  }

  public getChildRecords(recordId: string): ClientRecord[] {
    const records: ClientRecord[] = [];
    this.records.forEach((value) => {
      if (value.parentId === recordId) {
        records.push(value);
        this.getChildRecords(value.client_id).forEach(v => records.push(v));
      }
    });
    return records;
  }

  getUploadableRecords(): ClientRecord[] {
    const records: ClientRecord[] = [];
    this.records.forEach((value) => {
      if (value.valid && !value.isUploaded()) {
        // if (value.valid && (!value.id || value.modified)) {
        records.push(value);
        this.getChildRecords(value.client_id).forEach(v => records.push(v));
      }
    });
    return records;
  }

  getUploadedRecords(): ClientRecord[] {
    const records: ClientRecord[] = [];
    this.records.forEach((value) => {
      if (value.isUploaded()) {
        records.push(value);
        this.getChildRecords(value.client_id).forEach(v => records.push(v));
      }
    });
    return records;
  }

  async deleteUploadedRecords() {
    const records = this.getUploadedRecords();
    return await Promise.all(
      records.map(record => this.deleteRecord(record.client_id)),
    );
  }

  setRecord(record: ClientRecord) {
    this.records.set(record.client_id, record);
    return this.setStoredRecord(record).then(() => {
      this._changed.next(true);
    });
  }

  getRecord(clientId: string) {
    if (!this.records.has(clientId)) return null;
    return new ClientRecord(this.records.get(clientId));
  }

  getRecord$(clientId: string): Promise<ClientRecord | null> {
    return firstValueFrom(this.loaded$.pipe(
      map(() => {
        return this.getRecord(clientId);
      }),
    ));
  }

  async deleteRecord(clientId: string) {
    if (!this.records.has(clientId)) return;

    const record = this.records.get(clientId);
    if (!record) return;

    // Remove all photos associated with the record.
    await Promise.all(
      record.photoIds.map((photo) => {
        return this.photoService.removePhoto(photo);
      })
    );

    // Remove all the children records.
    await Promise.all(
      this.getChildRecords(record.client_id).map((child) => {
        return this.deleteRecord(child.client_id)
      }),
    );

    // Remove the record itself.
    await this.removeStoredRecord(record.client_id);

    // Update the record cache to not include the record.
    this.records.delete(clientId);

    // Notify of changes.
    this._changed.next(true);
  }

}
