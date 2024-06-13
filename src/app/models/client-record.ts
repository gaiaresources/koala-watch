import {Record} from "./record";
import * as GeoJSON from "geojson";
import {UUID} from "angular2-uuid";
import * as dayjs from "dayjs";

export class ClientRecord implements Record {
  id?: number;
  dataset?: number;
  site?: number | null;
  source_info?: { [key: string]: string | number };
  last_modified?: string;
  created?: string;
  data?: { [key: string]: any } | null;
  validated?: boolean;
  locked?: boolean;
  geometry?: GeoJSON.Geometry | null;
  species_name?: string;
  name_id?: number;
  parent?: number;
  children?: number[];

  client_id: string;
  valid: boolean;
  datasetName: string;
  parentId: string;
  datetime: string;
  count: number;
  photoIds: string[];

  constructor(data: any = {}) {
    this.client_id = data.client_id || UUID.UUID();
    this.valid = data.valid || false;
    this.datasetName = data.datasetName || "";
    this.parentId = data.parentId || "";
    this.datetime = data.datetime || dayjs().format();
    this.count = data.count || 0;
    this.photoIds = data.photoIds || [];
  }

}
