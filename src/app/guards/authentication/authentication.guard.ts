import {inject} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {RecordsService} from "../../services/records/records.service";
import {DatasetService} from "../../services/dataset/dataset.service";
import {firstValueFrom} from "rxjs";

export const AuthenticationGuardFn: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const recordsService = inject(RecordsService);
  const datasetService = inject(DatasetService);

  const token = authService.getToken();
  if (token) {
    await firstValueFrom(recordsService.loaded$);
    await firstValueFrom(datasetService.datasets$);
    await firstValueFrom(authService.user$);
    // authorised so return true
    return true;
  }

  // not logged in so redirect to login page with the return url
  router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
  return false;
};
