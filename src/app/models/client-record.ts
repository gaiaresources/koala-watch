import { Record } from "./record";

export interface ClientRecord extends Record {
  valid: boolean;
  datasetName: string;
  parentId?: string;
  datetime: string;
  count: number;
  photoIds: string[];
}
