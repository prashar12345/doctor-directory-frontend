import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

    constructor(  private spinner: NgxSpinnerService,public router: Router,private toastr: ToastrService, private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
  
            if (err.status === 401) {
                
                if (err.error.message && err.error.message!==''){
                  this.toastr.error(err.error.message,'Error');
                  this.authenticationService.logout();
                  this.router.navigateByUrl('/');
                }else if (err.error.error.message && err.error.error.message !== "") {
                    this.toastr.error(err.error.error.message,'Error');
                    this.spinner.hide()
                    this.authenticationService.logout();
                    this.router.navigateByUrl('/');
                  }  
      
            }else  if (err.status == 400) {
              if (err.error.message && err.error.message!==''){
                this.toastr.error(err.error.message,'Error');
              }else if (err.error.error.message && err.error.error.message !== "") {
                  this.toastr.error(err.error.error.message,'Error');
                }  
              }else  if (err.status == 404) { 
                console.log('error 33',err.error)
                if (err.error.message && err.error.message!==''){
                  this.toastr.error(err.error.message,'Error');
                } else  if (err.error.error.message && err.error.error.message !== "") {
                  this.toastr.error(err.error.error.message,'Error');
                } 
              }else if (err.status === 500) {
                if (err.error.message!==''){
                    this.toastr.error(err.error.message,'Error');
                  }else if (err.error.error.message !== "") {
                      this.toastr.error(err.error.error.message,'Error');
                    } 
            }
            // const error = err.error.message || err.code;
            return throwError(err.error);
        }))
    }
}