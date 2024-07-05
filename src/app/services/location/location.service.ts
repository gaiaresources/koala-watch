import {Injectable} from '@angular/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';
import {Coordinates} from "../../models/coordinates";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() {
  }

  public async getPosition(): Promise<Coordinates> {
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

    const location = await Geolocation.getCurrentPosition();
    return {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
      altitude: location.coords.altitude ?? "",
      accuracy: location.coords.accuracy ?? "",
    };
  }

}
