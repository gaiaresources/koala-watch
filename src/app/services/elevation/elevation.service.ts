import {Inject, Injectable} from '@angular/core';
import {GOOGLE_MAP_API} from "../../tokens/gmap";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, map, of} from "rxjs";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ElevationService {

  constructor(
    @Inject(GOOGLE_MAP_API) private apiKey: string,
    private httpClient: HttpClient,
  ) {
  }

  public async getElevation(lat: number, lng: number): Promise<number | ""> {
    const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${this.apiKey}`;
    return await firstValueFrom(
      this.httpClient.get(url).pipe(
        map((elevation: any) => {
          if (elevation['results']
            && elevation['results'][0]
            && elevation['results'][0]['elevation'] !== undefined
            && elevation['results'][0]['elevation'] !== null) {
            return parseInt(elevation['results'][0]['elevation'], 10);
          }
          return 0;
        }),
        catchError((err) => {
          return of<"">("");
        }),
      )
    );

  }
}
