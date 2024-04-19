import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, shareReplay, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from "../../models/user";
import { APIService } from "../api/api.service";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private auth_token = new BehaviorSubject<string>(
    localStorage.getItem('auth_token') || ""
  );
  public user$: Observable<User | null>;

  constructor(
    protected apiService: APIService
  ) {
    this.user$ = this.auth_token.asObservable().pipe(
      switchMap((token) => {
        return this.apiService.whoAmI();
      }),
      shareReplay(1),
    );
  }

  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string) {
    localStorage.setItem('auth_token', token);
    this.auth_token.next(token);
  }

  private clearToken() {
    localStorage.removeItem('auth_token');
    this.auth_token.next("");
  }

  public getCurrentUser$(): Observable<User | null> {
    return this.user$;
  }

  public login(username: string, password: string): Observable<User | null> {
    return this.apiService.getAuthToken(username, password).pipe(
      tap((res: string | null) => {
        if (res)
          this.setToken(res);
        else
          this.clearToken();
      }),
      switchMap(() => this.user$),
    );
  }

  public logout() {
    this.clearToken();
  }

}
