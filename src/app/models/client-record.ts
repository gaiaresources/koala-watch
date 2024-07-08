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
  modified?: boolean;

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
    if (data.id) this.id = data.id;
    if (data.dataset) this.dataset = data.dataset;
    if (data.site) this.site = data.site;
    if (data.source_info) this.source_info = data.source_info;
    if (data.last_modified) this.last_modified = data.last_modified;
    if (data.created) this.created = data.created;
    if (data.data) this.data = data.data;
    if (data.validated) this.validated = data.validated;
    if (data.locked) this.locked = data.locked;
    if (data.geometry) this.geometry = data.geometry;
    if (data.species_name) this.species_name = data.species_name;
    if (data.name_id) this.name_id = data.name_id;
    if (data.parent) this.parent = data.parent;
    if (data.children) this.children = data.children;
    if (data.modified) this.modified = data.modified;
  }

  isWriteable() {
    return !this.isUploaded();
  }

  isUploaded() {
    return !!this.id;
  }

}
