import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { APIService } from  '../../app/biosys-core/services/api.service';
import { AuthService } from '../../app/biosys-core/services/auth.service';

@Injectable()
export class MobileAuthService extends AuthService {
    constructor(private api: APIService) {
        super();
    }

    public getAuthToken(): string {
        return localStorage.getItem('auth_token');
    }

    public login(username: string, password: string) {
        return this.api.getAuthToken(username, password).pipe(
            map(res => localStorage.setItem('auth_token', res.token))
        );
    }

    public logout() {
        localStorage.removeItem('auth_token');
    }

    public isLoggedIn(): boolean {
        if (this.api.receivedUnauthenticatedError) {
            localStorage.removeItem('auth_token');
            return false;
        }

        return !!this.getAuthToken();
    }
}
