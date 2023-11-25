import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const TOKEN_KEY = 'token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  protected debug = false;
  private APIToken = null;
  token: any;
  currentUserData: any;

  constructor(private authService: AuthService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.currentUserData = JSON.parse(localStorage.getItem('credentials'));
    if (this.currentUserData) {
      let headers = {};
      const token = this.currentUserData.access_token ? this.currentUserData.access_token : '';
      if (token) {
        headers = {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
        };

        request = request.clone({
          setHeaders: headers
        });
      }
    }

    return next.handle(request);
  }
}