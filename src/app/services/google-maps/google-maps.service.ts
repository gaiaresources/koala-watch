import {Inject, Injectable} from '@angular/core';
import {GOOGLE_MAP_API} from "../../tokens/gmap";
import {DOCUMENT} from "@angular/common";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  private _loaded = new BehaviorSubject<boolean>(false);
  public loaded$ = this._loaded.asObservable();

  constructor(
    @Inject(GOOGLE_MAP_API) private apiKey: string,
    @Inject(DOCUMENT) private document: any,
  ) {
    const self = this;
    (window as any)['googleMapLoaded'] = function() {
      self._loaded.next(true);
    };
    this.addGoogleScript();
  }

  addGoogleScript() {
    const s = this.document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://maps.googleapis.com/maps/api/js?callback=googleMapLoaded&loading=async&key=' + this.apiKey;
    // TODO: The dynamic loading causes issues with some of the map behaviour.
    // s.innerHTML = '(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({\n' +
    //   '  v: "weekly",\n' +
    //   '  key: "'+ this.googleMapApi +'"\n' +
    //   '});'
    const head = this.document.getElementsByTagName('head')[0];
    head.appendChild(s);
  }

}
