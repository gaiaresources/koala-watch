import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { mergeMap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { from } from 'rxjs/observable/from';

import { Media, Record } from '../../biosys-core/interfaces/api.interfaces';
import { APIService } from '../../biosys-core/services/api.service';

import { ClientRecord, ClientPhoto } from '../interfaces/mobile.interfaces';


@Injectable()
export class UploadService {
    constructor(private storageService: StorageService, private apiService: APIService) {
    }

    public uploadValidRecords(): Observable<[ClientRecord, Record]> {
        return this.storageService.getAllValidRecords().pipe(
            mergeMap((clientRecord: ClientRecord) =>
                this.apiService.createRecord(clientRecord).pipe(
                    mergeMap((record: Record) => this.storageService.deleteRecord(record.client_id),
                             (record: Record, deleteRecordSuccess: boolean) => record)
                ),
                (clientRecord: ClientRecord, record: Record) =>
                    [clientRecord, record] as [ClientRecord, Record]
            )
        );
    }

    public uploadRecordPhotos(record: Record, photoIds): Observable<boolean> {
        return from(photoIds).pipe(
            mergeMap((photoId: string) => this.storageService.getPhoto(photoId).pipe(
                mergeMap((photo: ClientPhoto) => this.apiService.uploadRecordMediaBase64(record.id, photo.base64))),
                (photoId: string, media: Media) => photoId
                ),
            mergeMap((photoId: string) => this.storageService.deletePhoto(photoId))
        );
    }
}
