import { Injectable } from '@angular/core';

import { Observable ,  of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { User } from '../interfaces/api.interfaces';
import { APIService } from './api.service';

@Injectable()
export class AuthService {
    protected user: User;

    constructor(protected apiService: APIService) {
    }

    public getAuthToken(): string {
        return localStorage.getItem('auth_token');
    }

    public getCurrentUser(): Observable<User> {
        if (!this.user) {
            return this.apiService.whoAmI().pipe(
                tap((user: User) => this.user = user)
            );
        } else {
            return of(this.user);
        }
    }

    public login(username: string, password: string): Observable<User> {
        return this.apiService.getAuthToken(username, password).pipe(
            map(res => localStorage.setItem('auth_token', res['token'])),
            mergeMap(() => this.getCurrentUser())
        );
    }

    public logout() {
        this.user = null;
        localStorage.removeItem('auth_token');
    }

    public isLoggedIn(): boolean {
        if (this.apiService.receivedUnauthenticatedError) {
            localStorage.removeItem('auth_token');
            return false;
        }

        return !!this.getAuthToken();
    }
}
