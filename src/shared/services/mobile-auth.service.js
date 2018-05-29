"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var ng2_cookies_1 = require("ng2-cookies/ng2-cookies");
var MobileAuthService = (function () {
    function AuthService(api) {
        this.hasAuthToken = false;
        this.hasAuthToken = !!localStorage.getItem('auth_token');
        this.api = api;
    }
    AuthService.getAuthToken = function () {
        return localStorage.getItem('auth_token');
    };
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        return this.api.getAuthToken(username, password)
            .map(function (token) {
            // set the token
            localStorage.setItem('auth_token', token);
            _this.hasAuthToken = true;
        });
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        var localLogout = function () {
            localStorage.removeItem('auth_token');
            ng2_cookies_1.Cookie.deleteAll();
            _this.hasAuthToken = false;
        };
        return rxjs_1.Observable.create(function (observer) {
            _this.api.logout().subscribe(function () {
                localLogout();
                observer.next(true);
                observer.complete();
            }, function (error) {
                console.log('error.msg', error.msg);
                localLogout();
                observer.next(true);
                observer.complete();
            });
        });
    };
    AuthService.prototype.isLoggedIn = function () {
        return true;
    };
    return AuthService;
}());
MobileAuthService = __decorate([
    core_1.Injectable()
], MobileAuthService);
exports.AuthService = MobileAuthService;
