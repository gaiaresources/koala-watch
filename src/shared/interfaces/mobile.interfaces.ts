import { Record } from '../../biosys-core/interfaces/api.interfaces';

export interface ClientRecord extends Record {
    valid: boolean;
    clientId: string;
    datasetName: string;
    datetime: string;
}
