export interface APIError {
  status: number;
  statusText: string;
  msg: object | string[] | string;
}
