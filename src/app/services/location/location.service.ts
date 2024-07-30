import {Injectable} from '@angular/core';
import {Geolocation, PermissionStatus, Position} from '@capacitor/geolocation';
import {Coordinates} from "../../models/coordinates";
import {from, Observable, Subscription} from "rxjs";
import {AlertController} from "@ionic/angular/standalone";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private alertController: AlertController,
  ) {
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

  public watchPosition(): Observable<Position | null> {
    return new Observable(observer => {
      let id: any;
      Geolocation.watchPosition({}, (position) => {
        observer.next(position);
      }).then(callback => {
        id = callback;
      });

      return new Subscription(
        () => {
          observer.complete();
          Geolocation.clearWatch({id})
        });
    });
  }

  public getLocation(callback: (location: Coordinates) => void): Subscription {
    return from(this.getPosition()).subscribe({
      next: (location) => {
        callback(location);
      },
      error: async (_e) => {
        const alert = await this.alertController.create({
          message: 'Location unavailable',
        });
        await alert.present();
      }
    });
  }

}
