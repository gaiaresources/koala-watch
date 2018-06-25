import { Record } from '../../biosys-core/interfaces/api.interfaces';

export interface ClientRecord extends Record {
    valid: boolean;
    datasetName: string;
    parentId?: string;
    datetime: string;
    count: number;
    photoIds: string[];
    serverId?: number;
}

export interface ClientPhoto {
    id: string;
    recordId: string;
    fileName: string;
    base64: string;
    datetime: string;
    recordServerId?: number;
    mediaId?: number;
}

export interface ApiResponse {
    non_field_errors: string[];
}
