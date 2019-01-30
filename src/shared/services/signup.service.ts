import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators/catchError';
import { APIError } from 'biosys-core/interfaces/api.interfaces';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROJECT_NAME } from '../utils/consts';

// Keeping this as a separate class because of a few reasons
// 1: The idea that randoms can sign themselves up to Biosys is antithetical
//    to the original Biosys goals
// 2: There was some discussion about a fixed "admin token" that is used by OEH Koalas
//    to facilitate randoms creating their own accounts (i.e. hitting the createUser API
//    normally involves being logged in as an admin). So keep all the stuff that needs that
//    hard-coded admin user in one spot.
// 3: Related to 1, don't want to try and push changes into biosys-core

@Injectable()
export class SignupService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.server + environment.apiExtension;
  }

  private buildAbsoluteUrl(path: string, appendEndSlash: boolean = true) {
    return this.baseUrl + ((path && !path.endsWith('/')) && appendEndSlash ? path + '/' : path);
  }

  public signUp(username: string, password: string, email: string, name_given: string, name_last: string) {
    return this.httpClient.post(this.buildAbsoluteUrl('user'), {
        username: username,
        password: password,
        email: email,
        first_name: name_given,
        last_name: name_last,
        projects: [PROJECT_NAME]
      },
      {
        headers: new HttpHeaders({'content-type': 'application/json'})
      })
    .pipe(
      catchError((err, caught) => this.handleError(err, caught))
    );
  }

  private handleError(error: any, caught: Observable<any>) {
    const apiError: APIError = {
      status: error.status,
      statusText: error.statusText,
      msg: ''
    };
    const body = error.error;
    // the error message is either the body itself or in a 'detail' property
    if ('detail' in body) {
      apiError.msg = body['detail'];
    } else {
      apiError.msg = body;
    }
    return Observable.throw(apiError);
  }
}
