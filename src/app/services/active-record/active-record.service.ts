import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {RecordsService} from "../records/records.service";
import {ActivePhotoService} from "../active-photo/active-photo.service";
import {ClientRecord} from "../../models/client-record";
import * as dayjs from "dayjs";


@Injectable({
  providedIn: 'root'
})
export class ActiveRecordService {

  public _record = new BehaviorSubject<ClientRecord>(new ClientRecord());
  public record$ = this._record.asObservable();

  public _status = new BehaviorSubject<string>("");
  public status$ = this._status.asObservable();

  constructor(
    private recordsService: RecordsService,
    private photoService: ActivePhotoService,
  ) {
    this.record$.subscribe((record) => {
      this.photoService.setRecord(record);
    });

    // Always auto-update the photoIds for the values based on the changes to the photo service.
    this.photoService.photos$.subscribe((photos) => {
      const record = this._record.value;
      record.photoIds = photos.map(p => p.clientId);
      this._record.next(record);
    });
  }

  clear() {
    this._record.next(new ClientRecord());
    this._status.next("");
  }

  setRecord(record: ClientRecord) {
    this._record.next(record);
  }

  getRecord() {
    return this._record.value;
  }

  getClientId() {
    const record = this._record.value;
    return record.client_id;
  }

  setValues(data: any) {
    const record: any = this._record.value;
    for (let key in data) {
      record[key] = data[key];
    }
    this._record.next(record);
  }

  getStatus() {
    return this._status.value;
  }

  setStatus(status: string) {
    this._status.next(status);
  }

  async save() {
    const record = this._record.value;
    record.datetime = dayjs().format();
    await this.recordsService.setRecord(record);
    await this.photoService.save();
  }

}
