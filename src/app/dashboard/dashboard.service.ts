import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { CredentialsService } from '../auth/credentials.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private _baseUrl = environment.url;

  constructor(
    private credentialsService: CredentialsService,
    private httpClient: HttpClient) {

  }


  uploadImage(fileToUpload: File,type) {
    let params = '?modelName='+type
    const formData: FormData = new FormData();
    formData.append('data', fileToUpload, fileToUpload.name);
    formData.append('modelName',type);
    return this.httpClient.post(this._baseUrl + `uploadImages`+params,formData).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  add(context, url) {
    return this.httpClient.post(this._baseUrl + url, context).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  update(context, url) {
    return this.httpClient.put(this._baseUrl + url, context).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }

  get(url) {
    return this.httpClient.get(this._baseUrl + url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    )
  }


  getAll(url, param?) {
    let params = new HttpParams();
    if (param) {
      for (let key of Object.keys(param)) {
        params = params.set(key, param[key])
      }
    }
    return this.httpClient.get(this._baseUrl + url, { params: params }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    )
  }

  status(id, model, status) {
    let url = this._baseUrl + 'changeStatus?id=' + id + '&model=' + model + '&status=' + status;

    return this.httpClient.put(url, {}).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    )
  }


  deleteRecord(param?) {
    let params = new HttpParams();
    if (param) {
      for (let key of Object.keys(param)) {
        params = params.set(key, param[key])
      }
    }
    return this.httpClient.delete(this._baseUrl + 'delete', { params: params }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    )
  }

  deleteRecordPermanent(param?) {
    let params = new HttpParams();
    if (param) {
      for (let key of Object.keys(param)) {
        params = params.set(key, param[key])
      }
    }
    return this.httpClient.delete(this._baseUrl + 'permanent', { params: params }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.handleError)
    )
  }

  moveBackRecord(param?) {
    let params = new HttpParams();
    if (param) {
      for (let key of Object.keys(param)) {
        params = params.set(key, param[key])
      }
    }
    return this.httpClient.delete(this._baseUrl + 'delete/undo', { params: params }).pipe(
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

    if (error.error.code == 401) {
      return throwError(error.error.message);
    } else if (error.error.code == 404) {
      return throwError(error.error.message);
    }
    else if (error.error.code == "E_INVALID_NEW_RECORD") {
      return throwError('You entered invalid Email');
    }
    else{
      return throwError(
        'Something bad happened; please try again later.');
    }

    
  }

}
