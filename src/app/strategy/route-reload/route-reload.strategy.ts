import {ActivatedRouteSnapshot, BaseRouteReuseStrategy} from "@angular/router";

export class RouteReloadStrategy extends BaseRouteReuseStrategy {

  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false;
  }

}
