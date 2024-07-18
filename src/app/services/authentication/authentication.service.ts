import {Injectable} from '@angular/core';

import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap
} from 'rxjs';
import {User} from "../../models/user";
import {APIService} from "../api/api.service";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private auth_token = new BehaviorSubject<string>(this.getToken() || "");
  private _user = new BehaviorSubject<User | null>(this.getUser());
  public user$ = this._user.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1),
  );

  public loggedIn$: Observable<boolean>;

  constructor(
    protected apiService: APIService,
  ) {
    this.loggedIn$ = this.auth_token.asObservable().pipe(
      map((token) => {
        return token !== "";
      }),
      distinctUntilChanged(),
      shareReplay(1),
    );

    combineLatest([
      this.loggedIn$,
      this.user$,
    ]).pipe(
      switchMap(([logged_in, user]) => {
        if (logged_in && !user) return this.apiService.whoAmI();
        return of(null);
      })
    ).subscribe((user) => {
      if (user) this.setUser(user);
    });
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

  public getUser(): User | null {
    const user: string | null = localStorage.getItem('auth_user');
    if (!user) return null;
    return JSON.parse(user);
  }

  private setUser(user: User | null) {
    if (!user)
      localStorage.removeItem('auth_user');
    else
      localStorage.setItem('auth_user', JSON.stringify(user));
    this._user.next(user);
  }

  public login(username: string, password: string): Observable<User | null> {
    return this.apiService.getAuthToken(username, password).pipe(
      tap((res: string | null) => {
        if (res)
          this.setToken(res);
        else
          this.clearToken();
      }),
      switchMap((res) => res ? this.apiService.whoAmI() : of(null) ),
      tap((user: User | null) => {
        this.setUser(user);
      }),
    );
  }

  public logout() {
    this.clearToken();
  }

}
