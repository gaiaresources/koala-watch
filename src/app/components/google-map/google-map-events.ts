import {GoogleMap} from "@capacitor/google-maps";
import {NgZone} from "@angular/core";

export type GoogleMapEventListener<T> = (event: T) => void;

export class GoogleMapEvents {
  private map?: GoogleMap;
  private listeners = new Map<string, GoogleMapEventListener<any>[]>();

  constructor(private zone: NgZone) {
  }

  on<T>(eventName: string, callback: GoogleMapEventListener<T>) {
    const listeners = this.getListeners(eventName);
    listeners.push(callback);
    this.listeners.set(eventName, listeners);

    this.addListener(eventName);

    return callback;
  }

  private getListeners(eventName: string) {
    if (!this.listeners.has(eventName)) return [];
    return this.listeners.get(eventName) || [];
  }

  private addListener(eventName: string) {
    if (!this.map) return;
    const func = 'setOn' + eventName + 'Listener';
    (this.map as any)[func]((event: any) => {
      this.zone.run(() => {
        const listeners = this.getListeners(eventName);
        listeners.forEach(listener => listener(event));
      });
    });
  }

  setMap(map: GoogleMap) {
    this.map = map;
    this.listeners.forEach((value, eventName) => {
      this.addListener(eventName);
    });
  }

}
