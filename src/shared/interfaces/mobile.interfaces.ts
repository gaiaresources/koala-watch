import { Record } from '../../biosys-core/interfaces/api.interfaces';

export interface ClientRecord extends Record {
    valid: boolean;
    datasetName: string;
    datetime: string;
    count: number;
    photoIds: string[];
}

export interface PhotoRecord {
    id: string;
    parentId: string;
    fileName: string;
    base64: string;
    datetime: string;
}
