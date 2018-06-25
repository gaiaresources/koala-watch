import { Media, Record } from '../../biosys-core/interfaces/api.interfaces';

export interface ClientRecord extends Record {
    valid: boolean;
    datasetName: string;
    parentId?: string;
    datetime: string;
    count: number;
    photoIds: string[];
}

export interface ClientPhoto extends Media {
    clientId: string;
    recordClientId: string;
    fileName: string;
    base64: string;
    datetime: string;
}

export interface ApiResponse {
    non_field_errors: string[];
}
