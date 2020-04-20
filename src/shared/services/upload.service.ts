import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { mergeMap, map, catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

import { Media, Record, APIError } from '../../biosys-core/interfaces/api.interfaces';
import { APIService } from '../../biosys-core/services/api.service';

import { ClientPhoto, ClientRecord } from '../interfaces/mobile.interfaces';

@Injectable()
export class UploadService {
    constructor(private storageService: StorageService, private apiService: APIService, private httpClient: HttpClient) {
    }

    public uploadValidRecords(): Observable<[ClientRecord, Record]> {
        return this.storageService.getUploadableRecords().pipe(
            mergeMap((clientRecord: ClientRecord) => {
                return this.getElevation(clientRecord).pipe(
                    mergeMap((elevation: any) => {
                        // patch altitude if available
                        if (clientRecord?.data['Altitude'] === null || clientRecord?.data['Altitude'] === undefined) {
                            if (elevation['results']
                                && elevation['results'][0]
                                && elevation['results'][0]['elevation'] !== undefined
                                && elevation['results'][0]['elevation'] !== null) {
                                clientRecord.data['Altitude'] = parseInt(elevation['results'][0]['elevation'], 10);
                            }
                        }


                        return this.apiService.createRecord(clientRecord).pipe(
                            mergeMap((record: Record) => this.storageService.updateRecordId(clientRecord, record.id),
                                (record: Record, updateRecordServerIdSuccess: boolean) => record)
                        );
                    })
                );
            }
                ,
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

    public getElevation(record: ClientRecord): Observable<any> {

        const lat = record.data['Latitude'];
        const lng = record.data['Longitude'];

        const key = 'AIzaSyD16axSONu3sfHI6F0KBhaR8Cf7Ny7w0Nw';

        const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${key}`;

        return this.httpClient.get(url);

    }

}
