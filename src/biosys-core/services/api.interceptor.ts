import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {

    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getAuthToken();
        if (authToken) {
            req = req.clone({
                headers: req.headers.set('Authorization', 'Token ' + authToken),
                withCredentials: true
            });
        }

        return next.handle(req);
    }
}
