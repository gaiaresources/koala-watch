import {Injectable} from '@angular/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() {
  }

  public async getPosition() {
    const granted = (status: PermissionStatus) => {
      return status.coarseLocation === "granted" || status.location === "granted";
    };

    let status = await Geolocation.checkPermissions();
    if (!granted(status)) {
      let request = await Geolocation.requestPermissions();
      if (!granted(request)) {
        return Promise.reject();
      }
    }

    return await Geolocation.getCurrentPosition();
  }

}
