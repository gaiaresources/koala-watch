import {Injectable} from '@angular/core';
import {Geolocation, PermissionStatus} from '@capacitor/geolocation';
import {Coordinates} from "../../models/coordinates";
import {Observable, shareReplay, Subscription, take} from "rxjs";
import {AlertController} from "@ionic/angular/standalone";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private readonly watcher: Observable<Coordinates>;

  constructor(
    private alertController: AlertController,
  ) {
    const watcher: Observable<Coordinates> = new Observable(observer => {
      let id: any;

      this.getPosition().then((location) => {
        observer.next(location);
      }).then(() => {
        return Geolocation.watchPosition({}, (location) => {
          if (!location || !location.coords) return;
          const coords = location.coords;
          observer.next({
            lat: coords.latitude,
            lng: coords.longitude,
            altitude: coords.altitude ?? "",
            accuracy: coords.accuracy ?? "",
          });
        });
      }).then(callback => {
        id = callback;
      });

      return new Subscription(
        () => {
          observer.complete();
          Geolocation.clearWatch({id})
        });
    });

    this.watcher = watcher.pipe(shareReplay(1));
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

  public watchPosition(): Observable<Coordinates> {
    return this.watcher;
  }

  public getLocation(callback: (location: Coordinates) => void): Subscription {
    return this.watcher.pipe(take(1)).subscribe({
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
