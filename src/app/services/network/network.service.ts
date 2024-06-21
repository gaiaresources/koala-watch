import {Injectable} from '@angular/core';
import {Network} from '@capacitor/network';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private _status = new BehaviorSubject<boolean>(false);
  public status$ = this._status.asObservable();

  constructor() {
    // Get the initial status of the network.
    Network.getStatus().then((status) => {
      this._status.next(status.connected);
    });

    // Accommodate for changes in the network status.
    Network.addListener('networkStatusChange', (status) => {
      this._status.next(status.connected);
    });
  }
}
