import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { mergeMap, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

import { Media, Record } from '../../biosys-core/interfaces/api.interfaces';
import { APIService } from '../../biosys-core/services/api.service';

import { ClientPhoto, ClientRecord } from '../interfaces/mobile.interfaces';
import { ILatLng } from '@ionic-native/google-maps';

@Injectable()
export class UploadService {
    constructor(private storageService: StorageService, private apiService: APIService, private httpClient: HttpClient) {
    }

    public uploadValidRecords(): Observable<[ClientRecord, Record]> {
        return this.storageService.getUploadableRecords().pipe(
            mergeMap((clientRecord: ClientRecord) =>
                    this.apiService.createRecord(clientRecord).pipe(
                        mergeMap((record: Record) => this.storageService.updateRecordId(clientRecord, record.id),
                            (record: Record, updateRecordServerIdSuccess: boolean) => record)
                    ),
                (clientRecord: ClientRecord, record: Record) =>
                    [clientRecord, record] as [ClientRecord, Record]
            )
        );
    }

    public uploadPendingRecordPhotos(): Observable<[ClientPhoto, Media]> {
            return this.storageService.getAllPendingPhotos().pipe(
                mergeMap((clientPhoto: ClientPhoto) =>
                        this.apiService.uploadRecordMediaBase64(clientPhoto.record, clientPhoto.base64).pipe(
                            mergeMap((media: Media) => this.storageService.updatePhotoMediaId(clientPhoto, media.id),
                                (media: Media) => media)
                        ),
                    (clientPhoto: ClientPhoto, media: Media) =>
                        [clientPhoto, media] as [ClientPhoto, Media]

                )
            );
    }

    public fillElevation(record: Record): Observable<Record> {
        const l: ILatLng = {
            lat: record.data['Latitude'],
            lng: record.data['Longitude']
        };

        const url = 'https://maps.googleapis.com/maps/api/elevation/json';

        console.log("record to upload", record, "latlong", l);

        return this.httpClient.post(url, record, {
                params: {
                  locations: '39.7391536,-104.9847034',
                  key: 'AIzaSyBAL66QBq-RH9pStWPUMyTdm9t05QtUmXg'
                }
            })
            .pipe(
                catchError((err, caught) => this.handleError(err, caught))
            );
    }
}
