import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { mergeMap } from 'rxjs/operators';
import { StorageService } from './storage.service';

import { Record } from '../../biosys-core/interfaces/api.interfaces';
import { APIService } from '../../biosys-core/services/api.service';

import { ClientRecord } from '../interfaces/mobile.interfaces';


@Injectable()
export class UploadService {
    constructor(private storageService: StorageService, private apiService: APIService) {
    }

    public uploadValidRecords(): Observable<[ClientRecord, Record]> {
        return this.storageService.getAllValidRecords().pipe(
            mergeMap((clientRecord: ClientRecord) =>
                    this.apiService.createRecord(clientRecord).pipe(
                        mergeMap((record: Record) => this.storageService.updateRecordServerId(clientRecord, record.id),
                            (record: Record, updateRecordServerIdSuccess: boolean) => record)
                    ),
                (clientRecord: ClientRecord, record: Record) =>
                    [clientRecord, record] as [ClientRecord, Record]
            )
        );
    }

    public uploadPendingRecordPhotos() {
        this.storageService.getAllPendingPhotos().subscribe(clientPhoto => {
            this.storageService.getRecord(clientPhoto.recordId).subscribe( record => {
                this.storageService.updatePhotoRecordServerId(clientPhoto, record.serverId).subscribe(success => {
                    this.apiService.uploadRecordMediaBase64(clientPhoto.recordServerId, clientPhoto.base64).subscribe(media => {
                        this.storageService.updatePhotoMediaId(clientPhoto, media.id).subscribe();
                    });
                });
            });
        });
    }
}
