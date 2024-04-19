import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService
  ) {

  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    if (authToken) {
      req = req.clone({
        headers: req.headers.set('Authorization', 'Token ' + authToken),
        withCredentials: true
      });
    }

    return next.handle(req);
  }
}
