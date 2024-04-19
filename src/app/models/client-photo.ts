import { Media } from "./media";

export interface ClientPhoto extends Media {
  clientId: string;
  recordClientId: string;
  fileName: string;
  base64: string;
  datetime: string;
}
