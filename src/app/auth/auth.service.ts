import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { CredentialsService } from './credentials.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _baseUrl = environment.url;

  constructor(
    private credentialsService: CredentialsService,
    private httpClient: HttpClient) {

  }

  /**
* @method
* @name login
* @description
* Authenticates the user.
* Request body:json {
       'email': string,
       'password': string
* }
* @param context The login parameters.
* @return Promise.
*/
  login(context) {
    // let param = this.getParams(context);
    // let param = new HttpParams();
    // for (let key of Object.keys(context)) {
    //   param = param.set(key, context[key])
    // }
    localStorage.removeItem("logout")
    return this.httpClient.post(this._baseUrl + `user/signin`, context).pipe(
      map((response: any) => {     
        this.credentialsService.setCredentials(response.data);
        return response;
      }),
      catchError(this.handleError)
    );
  }

  Signup(context) {
    // let param = this.getParams(context);
    return this.httpClient.post(this._baseUrl + `signup`, context).pipe(
      map((response: any) => {        
        return response;
      }),
      catchError(this.handleError)
    )

  }

  logout() {
    this.credentialsService.setCredentials();
    return of(true);
  }

  changePass(params) {
    let param = this.getParams(params);
    return this.httpClient.post(this._baseUrl + 'changePassword', param).pipe(
      map((response: any) => {      
        return response;
      }),
      catchError(this.handleError)
    )
  }

  sendEmail(formData): Observable<any> {
    return this.httpClient.post(this._baseUrl + `forgotpassword`, formData).pipe(
      map((response: any) => {     
        return response;
      }),
      catchError(this.handleError)
    )
  }

  resetPassword(formData): Observable<any> {
    return this.httpClient.put(this._baseUrl + `resetPassword`, formData).pipe(
      map((response: any) => {    
        return response;
      }),
      catchError(this.handleError)
    )
  }

  getParams(parameters) {
    let params = new HttpParams();
    Object.keys(parameters).map((key) => {
      params = params.set(key, parameters[key]);
    })
    return params;
  }

  handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error.code == 401) {
      return throwError('');
    } else if (error.error.code == 404) {
      return throwError(error.error.message);
    }else if (error.error.code == 403) {
      // console.log("403 hit")
      return throwError(error.error.message);
    }else if (error.error.code == 500) {
      console.log(error.error.message)
      return throwError(error.error.message);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
