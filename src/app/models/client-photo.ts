import {Media} from "./media";
import * as dayjs from "dayjs";

export class ClientPhoto implements Media {
  id?: number;
  file?: string;
  created?: string;
  last_modified?: string;
  filesize?: number;

  clientId: string;
  recordClientId: string;
  fileName: string;
  base64: string;
  datetime: string;

  constructor(data: any = {}) {
    this.clientId = data.clientId;
    this.recordClientId = data.recordClientId;
    this.fileName = data.fileName;
    this.base64 = data.base64;
    this.datetime = data.datetime;
    if (data.id) this.id = data.id;
    if (data.file) this.file = data.file;
    if (data.created) this.created = data.created;
    if (data.last_modified) this.last_modified = data.last_modified;
    if (data.filesize) this.filesize = data.filesize;
  }

  needsUpdating() {
    if (!this.last_modified) return true;
    const lastModified = dayjs(this.last_modified);
    const currentModified = dayjs(this.datetime);
    return lastModified.isBefore(currentModified);
  }

}
