import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "./authentication.service";

export const AuthenticationGuardFn: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  const token = authService.getToken();
  if (token) {
    // authorised so return true
    return true;
  }

  // not logged in so redirect to login page with the return url
  router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
  return false;
};
